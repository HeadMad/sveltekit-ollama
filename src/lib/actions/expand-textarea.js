export default function(node, max = Infinity) {
  let valueLength = node.value.length;
  const min = node.rows;
  let rowsNum = (node.value.match(/\n/g)?.length ?? 0) + 1

  let formReset;
  const form = node.closest('form');

  const handleCheck = (event) => {
    if ( event.key === "Enter" || (valueLength - node.value.length) !== 0) {
      let newRowsNum = (node.value.match(/\n/g)?.length ?? 0) + 1;
 
      if (newRowsNum !== rowsNum) {
        rowsNum = newRowsNum;
        node.rows = Math.max(min, Math.min(max, rowsNum));
      }
      node.scrollTop = node.scrollHeight;
    }

    valueLength = node.value.length;
  };

  node.addEventListener('keyup', handleCheck);
  if (form) {
    formReset = () => {
      node.rows = min;
      rowsNum = min;
      valueLength = 0;
    };
    form.addEventListener('reset', formReset);
  }
  

  return {
    destroy() {
      node.removeEventListener('keyup', handleCheck, true);
      if (form)
        form.removeEventListener('reset', formReset);
    }
  }
}