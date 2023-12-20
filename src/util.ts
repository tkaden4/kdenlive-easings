export function selectElementContents(el: HTMLElement) {
  var range;
  if (window.getSelection && document.createRange) {
    range = document.createRange();
    var sel = window.getSelection()!;
    range.selectNodeContents(el);
    sel.removeAllRanges();
    sel.addRange(range);
  }
}
