export default function (node, max = Infinity) {
  let valueLength = node.value.length;
  const min = node.rows;
  let rowsNum = (node.value.match(/\n/g)?.length ?? 0) + 1;

  let height, padding, border = node.offsetHeight - node.clientHeight;

  const size = { [min]: node.offsetHeight };
  node.style.height = size[min] + 'px';

  let formReset;
  const form = node.closest('form');

  const setSize = (num) => {
    if (!height) {
      height = (node.scrollHeight + border - size[min]) / (num - min);
      padding = size[min] - border - height * min;
    }
    size[num] = height * num + padding + border;
  };

  const setNodeParams = (num) => {
    if (!size[num])
      setSize(num);

    node.style.height = size[num] + 'px';
    rowsNum = num;
    node.rows = rowsNum;
  };

  const handleCheck = (event) => {
    if (event.key === "Enter" || (valueLength - node.value.length) !== 0) {
      let newRowsNum = Math.max(min, Math.min(max, (node.value.match(/\n/g)?.length ?? 0) + 1))

      if (rowsNum !== newRowsNum)
        setNodeParams(newRowsNum);

      node.scrollTop = node.scrollHeight;
    }

    valueLength = node.value.length;
  };

  node.addEventListener('keyup', handleCheck);
  if (form) {
    formReset = () => {
      setNodeParams(min);
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