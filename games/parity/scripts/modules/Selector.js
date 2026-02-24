var Selector = (function() {

  var selector; // the selector
  var coordinates = {
    x: 0,
    y: 0
  };

  var snapTo = function(x, y) {
    coordinates.x = x;
    coordinates.y = y;
    var cell = $('td[data-x="' + x + '"][data-y="' + y + '"]');
    var box = $('#box');
    var boxOffset = box.offset();
    selector.animate({
      top: (cell.offset().top - boxOffset.top + cell.height() / 2) + 'px',
      left: (cell.offset().left - boxOffset.left + cell.width() / 2) + 'px'
    }, 100, function() {
      //todo when complete
    });
  };

  var resnap = function() {
    var cell = $('td[data-x="' + coordinates.x + '"][data-y="' + coordinates.y + '"]');
    var box = $('#box');
    var boxOffset = box.offset();
    selector.css('top', (cell.offset().top - boxOffset.top + cell.height() / 2) + 'px');
    selector.css('left', (cell.offset().left - boxOffset.left + cell.width() / 2) + 'px');
  };

  var fadeIn = function() {
    selector.fadeIn(options.fade);
  };

  var fadeOut = function() {
    selector.fadeOut(options.fade);
  };

  var quickHide = function() {
    selector.hide();
  };

  var quickShow = function() {
    selector.show();
  };

  var domReady = function() {
    selector = $("#selector");
  };

  return {
    snapTo: snapTo,
    resnap: resnap,
    fadeIn: fadeIn,
    fadeOut: fadeOut,
    quickHide: quickHide,
    quickShow: quickShow,
    domReady: domReady
  };
}());

// Add the mediator to the module
mediator.installTo(Selector);

Selector.subscribe('selector_snap_to', Selector.snapTo);
Selector.subscribe('window_resized', Selector.resnap);
Selector.subscribe('board_faded_in', Selector.fadeIn);
Selector.subscribe('board_fade_out', Selector.fadeOut);

Selector.subscribe('loader_dom_ready', Selector.domReady);
