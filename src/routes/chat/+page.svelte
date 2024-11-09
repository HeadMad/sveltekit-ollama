<script>
  import { Loader } from "$lib/components";
  import { expandTextareaHeight } from "$lib/actions";
  import { enhance, applyAction } from "$app/forms";
  import {Ollama} from '$lib/utils';
  import { browser } from "$app/environment";
  
  let {form, data} = $props();
  const messages = $state([]);
  let context = $state();
  let prompt = $state('');
  let isSubmitted = $state(false);

  let aborter = new AbortController();

  let msg = $state();


  if (browser) {
    document.addEventListener("keydown", (event) => {
      if (isSubmitted && event.key === "Escape") {
        aborter.abort();
      }
    });
  }

  function onCtrlEnter(event) {
    if (event.key === "Enter" && event.ctrlKey) {
      event.preventDefault();
      document.querySelector("button").click();
    }
  }

  async function onSubmit(event) {
    event.preventDefault();
    isSubmitted = true;
    messages.push({content: prompt, role: "user"});
    prompt = '';
    const message = $state({content: '', role: 'assistant'});
    messages.push(message);
    msg.scrollTop = msg.scrollHeight;
    await Ollama().chat({
      messages,
      stream(chunk, abort) {
        message.content += chunk.message.content;
        msg.scrollTop = msg.scrollHeight;
        if (aborter.signal.aborted) {
          abort();
          aborter = new AbortController();
        }
      }
    });

    isSubmitted = false;
    // prompt = '';
    event.target.reset();
  }

  function onChangeMessage(event) {
    let i = event.target.dataset.i;
    messages[i].content = event.target.innerHTML.replace(/<br>/g, '\n');
  }


 
</script>

<main>
  <label for="text" class="status">
    Сообщение для
  </label>
  <div class="messages" bind:this={msg}>
    {#each messages as {content, role}, i}
      <div class={role}>
        <p contenteditable data-i={i} oninput={onChangeMessage}>{content}</p>
      </div>
    {/each}
    <!-- <pre>{JSON.stringify(form, null, 2)}</pre> -->
  </div>
    <form method="POST"  onsubmit={onSubmit}>
      <label class="text-area">
        <textarea
          id="prompt"
          rows="1"
          name="prompt"
          bind:value={prompt}
          onkeydown={onCtrlEnter}
          disabled={isSubmitted}
          use:expandTextareaHeight={6}
        ></textarea>
        <button type="submit" disabled={!prompt.trim() || isSubmitted}>
          {#if isSubmitted}
            <Loader size="20px" color="#000" thickness="2px" />
          {:else}
            <img src="finger.svg" alt="" />
          {/if}
        </button>
      </label>

      <input type="hidden" name="context" value={context} />
    </form>
    <div class="progress"></div>

</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    height: 100vh;
    margin: auto;
    border-width: 0 1px;
    border-style: solid;
    border-color: #ccc;
    max-width: 500px;
  }

  .messages p {
    padding: .7em 1em;
    border-radius: .8em;
    background: #eee;
    display: inline-block;
    text-align: left;
  }

  .user {
    text-align: right;
    margin-left: 3em;
    & p {
      border-bottom-right-radius: 0;
      background-color: #cde6f9;
    }
  }

  .assistant {
    margin-right: 3em;
    & p {
      border-bottom-left-radius: 0;
    }
  }

  .status {
    line-height: 24px;
    padding: 9px;
    border: 1px solid #ccc;
    border-width: 1px 0;
    /* width: 100%; */
  }

  .messages {
    flex-grow: 1;
    overflow: auto;
    padding: 9px;

    &::-webkit-scrollbar {
      width: 2px;
    }

    &::-webkit-scrollbar-track {
      background: #fff;
      padding-right: 5px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #ccc;
      border-radius: 1px;
      border: 0;
      width: 2px;
    }
  }

  form {
    width: 100%;
    position: relative;
  }

  .text-area {
    position: relative;
    display: block;

    &::after {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      border-top: 1px solid #ccc;
      height: 18px;
      width: 100%;
      background: linear-gradient(#fff, transparent);
    }
  }

  textarea {
    font-family: inherit;
    display: block;
    box-sizing: border-box;
    line-height: 22px;
    font-size: 16px;
    overflow-y: auto;
    resize: none;
    outline: 0;
    width: 100%;
    border: 1px solid #ccc;
    border-width: 1px 0;
    padding: 14px 45px 14px 14px;
    transition: .3s;

    &::-webkit-scrollbar {
      width: 2px;
    }

    &::-webkit-scrollbar-track {
      background: #fff;
      padding-right: 5px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #ccc;
      border-radius: 1px;
      border: 0;
      width: 2px;
    }
  }

  button {
    position: absolute;
    bottom: 0;
    padding: 15px 15px 15px 5px;
    height: 50px;
    width: 40px;
    right: 0;
    background: none;
    border: none;
    /* outline: 1px solid #ccc; */
    cursor: pointer;
    z-index: 1;
    user-select: none;
    -moz-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -o-user-select: none;

    &[disabled] {
      opacity: 0.3;
    }
  }
  img {
    width: 20px;
    height: 20px;
  }

  .progress {
    height: 4px;
    background: #ccc;
  }

  .progress.active {
    background: linear-gradient(
      -45deg,
      #ff3155 25%,
      #ffaf42 25%,
      #ffaf42 50%,
      #ffed5e 50%,
      #ffed5e 75%,
      #2daefd 75%,
      #ff3155 0%
    );
    animation: gradient 10s infinite linear;
  }

  @keyframes gradient {
    to {
      background-position: 1000px 0;
    }
  }
</style>
