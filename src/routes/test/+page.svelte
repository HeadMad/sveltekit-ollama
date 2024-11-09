<script>
  import Ollama from '$lib/utils/ollama';
  let value = $state('');
  let result = $state('');
  let res = $state({});
async function onclick() {
  let i = 4;
  const resp = await Ollama().generate({
    prompt: value,
    stream: (chunk, abort) => {
      if (--i)
        return i
      else 
        abort();
    }
  });

  console.log(resp)
  

    value = '';
}
</script>

<textarea name="" id="" bind:value></textarea>

<button {onclick}>Send</button>
{result}
<!-- <pre>{JSON.stringify(res, null, 2)}</pre> -->