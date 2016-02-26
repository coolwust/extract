class Evaluation {

  info() {
    const entities = document.querySelectorAll('.entry_content');
    for (let i = 0, l = entities.length; i < l; i++) {
      const data = this.entity(entities[i]);
      console.log(JSON.stringify(data));
    }
  }

  // { model, vendor, date, size, link, err }
  entity(el) {
    const data = {};
    const ite = document.createNodeIterator(el, NodeFilter.SHOW_ALL);
    let   node;
    while ((node = ite.nextNode()) !== null) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.data.trim();
        if (/^\w+ \d{6} \d{4}/.test(text)) {
          const arr = text.split(' ');
          //if (this.model() !== arr[0]) {
          //  return {error: "unmatched model"};
          //}
          data.model = arr[0];
          let date = ['20' + arr[1].substr(-2), arr[1].substr(2, 2) - 1, arr[1].substr(0, 2)];
          let time = [arr[2].substr(0, 2), arr[2].substr(-2)];
          data.timestamp = Math.floor(new Date(...date, ...time).getTime() / 1000);
          data.vendor = arr[arr.length - 1];
          continue;
        }
        if (/^Size:/.test(text)) {
          data.size = text.split(' ')[1];
        }
      } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'A') {
        const link = node.getAttribute('href');
        if (/pip.bz/.test(link)) {
          data.link = link;
        }
      }
    }
    return data;
  }

  model() {
    if ('_model' in this) {
      return this._model;
    }
    let arr = document.URL.split("=");
    if (arr.length !== 2 || arr[1] === '') {
      window.callPhantom({error: "model name not found in document URL"});
    }
    return this._model = arr[1];
  }
}

const e = new Evaluation();
e.info();
