// v-noDataTip
export default{
  mounted: function(el, binding, vnode) {
    const text = binding.value || '暂无数据';
    el.classList.add('pub-no-data-tip');
    el.innerHTML = `
        <div>
          <div class="icon"></div>
          <div class="text">${text}</div>
        </div>
      `;
  }
};
