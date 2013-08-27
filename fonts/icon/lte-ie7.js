/* Load this script using conditional IE comments if you need to support IE 7 and IE 6. */

window.onload = function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'icon\'">' + entity + '</span>' + html;
	}
	var icons = {
			'icon-arrow-right' : '&#x67;',
			'icon-untitled' : '&#x6d;',
			'icon-untitled-2' : '&#x62;',
			'icon-untitled-3' : '&#x74;',
			'icon-untitled-4' : '&#x2b;',
			'icon-untitled-5' : '&#x78;',
			'icon-cogs' : '&#x73;',
			'icon-target' : '&#x68;',
			'icon-battery' : '&#x50;',
			'icon-minus-alt' : '&#x2d;',
			'icon-battery-half' : '&#x70;',
			'icon-list' : '&#x6e;',
			'icon-designmodo-location' : '&#x6c;'
		},
		els = document.getElementsByTagName('*'),
		i, attr, html, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		attr = el.getAttribute('data-icon');
		if (attr) {
			addIcon(el, attr);
		}
		c = el.className;
		c = c.match(/icon-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
};