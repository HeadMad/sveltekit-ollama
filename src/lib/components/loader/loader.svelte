<script>
  export let color = "#fff";
  export let size = "48px";
  /** @type {string | null} */
  export let thickness = null;
</script>

<span style="width: {size}; height: {size}; border-width: {thickness ?? Math.floor(size/10)};"/>

<style>
  span {
    border-style: solid;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
    }

    @keyframes rotation {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
    } 
</style>