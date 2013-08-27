var bas; //variable de estaciones en xml
localStorage.offline;//define uso de mapas
localStorage.notificaciones;//define uso de notificaciones
var touchinX,touchinY;//movimiento de los mapas

function inicio()
{
	//carga de base
	base();
	//carga configuración en menu
	premenu();
	//Listeners
	$('#bmenu').on('touchstart', showmenu);
	$('#back').on('touchstart', hidemenu);
	$('.b').on('touchstart', mmapa);
	$('.b').on('touchend', mmapa1);
	$('#tbuscar').on('keyup',buscar);
	$('#tbuscar').on('focus',mbocultar);
	$('#op div').on('touchstart', opc);
	touchlisteners();
	notification();
}
function notification()
{
	 var notification = navigator.mozNotification.createNotification(
                "Activa GPS",
                "GPS para encontrar una estación." 
            );
             notification.show();
}

function base()
{
	$.ajax({
			type:"GET",
			url:"estaciones.xml",
			dataType:"html",
			error:function(jqXHR, status){
				alert("Error con la base de datos"+status);
			},	
			success:function(xml){
				bas=xml;
				console.log('success');
			}
	});
}

function premenu()
{
	if(localStorage.offline==1)
	{
		$('#offline').attr('checked',true);
	}
	else
	{	
		$('#offline').attr('checked', false);
	}
	if(localStorage.notificaciones==1)
		$('#notificaciones').attr('checked', true);
	else
		$('#notificaciones').attr('checked', false);
}

function opc()
{

	if(this.id=="offline")
	{	
		if(localStorage.offline==1)
			localStorage.offline=0;
		else
			localStorage.offline=1;
	}
	else
	{
		if(localStorage.notificaciones==1)
			localStorage.notificaciones=0;
		else
			localStorage.notificaciones=1;
	}
}

function showmenu()
{
	$('#menu').css('left',0);
}

function hidemenu()
{
	$('#menu').css('left','-100%');
}

function touchlisteners()
{
	document.getElementById('menu').addEventListener('touchstart', function(event){slideinit(event, this)}, false);
}

function slideinit(e1, mero)
{
	e1.preventDefault();
	mero.addEventListener('touchmove', function(event){slideevent(event, e1)}, false);
}

function slideevent(e2,e1)
{
	var deslice=(e1.targetTouches[0].clientX)-(e2.targetTouches[0].clientX);
	if(deslice>100)
	{
		hidemenu();
	}
}

function mmapa()
{
	event.stopPropagation();
	$(this).css('background-color', $(this).attr('data-color'));
	$(this).css('color','#fff');
}

function mmapa1()
{
	$('header').html('<h1>Transportes</h1>').appendTo($('header'));
	$('#op').hide();
	hidemenu();

	if(this.id!='opciones')
	{

		if(localStorage.offline!=1)
			mapa_offline(this.id);
		else if(localStorage.offline==1)
			mapa_online(this.id);
	}
	else
	{
		$('#res').html('');
		$('#op').show();
	}

	window.scrollTo(0,0);

}

function mapa_offline(este)
{
	var estemapa='img/l'+este+'.svg';
	$(este).css('background-color','#fff');
	$(este).css('color','#454545');

	$.ajax({
			type:"GET",
			url:estemapa,
			async: false,
			dataType:"html",
			success: function(mapsvg){
				
				$('#res').html('');
				$('#res').append($('<div class="marco">' +mapsvg+'</div>' ));
			}
		});
}

function mapa_online(este)
{
	
	var b=$(este).children('img').attr('class')+' '+$(este).children('.info').children('.titulo').text()+' Distrito Federal';
	var b1;
	var map8=$('<div id="map" ></div>');
	
	$('#res').append(map8);
	
	 $("#map").gmap('search', { 'address': b }, function(results,isFound) {
	 	console.log(isFound);
            if (isFound)
             {
            	console.log(results);
            	console.log(b);
            	$('#map').gmap('get','map').panTo(results[0].geometry.location);
            	$('#map').gmap('get','map').setOptions({"zoom":16});             
            }
            else
            {
            	console.log(results);
            }
        });


	
}

function successmap(position)
{
	//alert('Actualmente estas usando el sistema de wifi y datos para mostrar mapas.');
	try{  var notification = navigator.mozNotification.createNotification(
                "Localizado",
                "Lat:"+position.coords.latitude+",Lon:"+position.coords.longitude+"." 
            );
             notification.show();
         }
    catch(e)
    {
    	console.log(e.message);
    }     
            var p=new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
           $('#map').gmap('get','map').setOptions({"center":p});
	//$('#res').html($('<p> Lat:'+position.coords.latitude+',Lon:'+position.coords.longitude+'</p>'));
}
function errormap(position)
{
	alert('error');
}
function buscar()
{ 
	$('#op').hide();
	$('header').html('<h1>Transportes</h1>').appendTo($('header'));
setTimeout(function(){


	var aux=$('<ul></ul>');
	var estacion= $('#tbuscar').val().toLowerCase();
	$('#res').html('');
	if(estacion!="")
	{
		//comprobación de búsqueda por línea
		if(estacion.indexOf("linea")!=-1)
		{
			var nlinea=0;
			nlinea=estacion.charAt(5);
			if(nlinea==NaN)
			 nlinea=estacion.charAt(6);
			console.log(parseInt(nlinea));
			$(bas).find('estacion').each(function(i){
		
			if($(this).attr('linea')==nlinea)
			{
				$('<li class="item" data-ecolor="'+$(this).attr('red')+'-'+$(this).attr('linea')+'"data-red="'+$(this).attr('red').toLowerCase()+'" data-linea="'+$(this).attr('linea')+'" ><img src="img/thumb/'+$(this).attr('value').removeAccents()+'_'+$(this).attr('red').replace(' ','')+'_'+$(this).attr('linea')+'.gif"/><div class="info"><p class="titulo" >'+$(this).attr('value')+'</p><p class="des">'+$(this).attr('red')+' línea:'+$(this).attr('linea')+'</p></div> <div data-icon="g" ></div> </li>').appendTo(aux);

				//$('<li><img src="img/thumb/'+$(this).attr('value')+'_'+$(this).attr('red')+'_'+$(this).attr('linea')+'.gif"/><div class="info"><p class="titulo" >'+$(this).attr('value')+'</p><p class="des">Red: '+$(this).attr('red')+' línea:'+$(this).attr('linea')+'</p></div> <div data-icon="g" ></div> </li>').appendTo(aux);
			}
		});


		}

		else if(estacion=="metro")
		{
			$(bas).find('metro').each(function(i){
				$(this).find('estacion').each(function(i){
				$('<li class="item" data-ecolor="'+$(this).attr('red')+'-'+$(this).attr('linea')+'"data-red="'+$(this).attr('red').toLowerCase()+'" data-linea="'+$(this).attr('linea')+'" ><img src="img/thumb/'+$(this).attr('value').removeAccents()+'_'+$(this).attr('red')+'_'+$(this).attr('linea')+'.gif"/><div class="info"><p class="titulo" >'+$(this).attr('value')+'</p><p class="des">'+$(this).attr('red')+' línea:'+$(this).attr('linea')+'</p></div> <div data-icon="g" ></div> </li>').appendTo(aux);
				});

			});
		
		}
		
		else if(estacion=="metrobus")
		{	
			$(bas).find('metrobus').each(function(i){
				$(this).find('estacion').each(function(i){
				$('<li class="item" data-ecolor="'+$(this).attr('red')+'-'+$(this).attr('linea')+'"data-red="'+$(this).attr('red').toLowerCase()+'" data-linea="'+$(this).attr('linea')+'" ><img src="img/thumb/'+$(this).attr('value').removeAccents()+'_'+$(this).attr('red')+'_'+$(this).attr('linea')+'.gif"/><div class="info"><p class="titulo" >'+$(this).attr('value')+'</p><p class="des">'+$(this).attr('red')+' línea:'+$(this).attr('linea')+'</p></div> <div data-icon="g" ></div> </li>').appendTo(aux);
				});

			});
			
		}

		else if(estacion.indexOf("tren")!=-1)
		{	
			$(bas).find('trenl').each(function(i){
				$(this).find('estacion').each(function(i){
				$('<li class="item" data-ecolor="'+$(this).attr('red').replace(' ','')+'-'+$(this).attr('linea')+'"data-red="'+$(this).attr('red').toLowerCase()+'" data-linea="'+$(this).attr('linea')+'" ><img src="img/thumb/'+$(this).attr('value').removeAccents()+'_'+$(this).attr('red').replace(' ','')+'_'+$(this).attr('linea')+'.gif"/><div class="info"><p class="titulo" >'+$(this).attr('value')+'</p><p class="des"> '+$(this).attr('red')+' línea:'+$(this).attr('linea')+'</p></div> <div data-icon="g" ></div> </li>').appendTo(aux);
				});

			});
			
		}
		//busueda por estacion
		else
		{

		$(bas).find('estacion').each(function(i){
		
			if($(this).attr('value').removeAccents().toLowerCase().indexOf(estacion.removeAccents())!=-1)
			{
				$('<li class="item" data-ecolor="'+$(this).attr('red').replace(' ','')+'-'+$(this).attr('linea')+'" data-red="'+$(this).attr('red').toLowerCase()+'" data-linea="'+$(this).attr('linea')+'" ><img class="'+$(this).attr('red')+'" src="img/thumb/'+$(this).attr('value').removeAccents()+'_'+$(this).attr('red').replace(' ','')+'_'+$(this).attr('linea')+'.gif"/><div class="info"><p class="titulo" >'+$(this).attr('value')+'</p><p class="des">'+$(this).attr('red')+' línea:'+$(this).attr('linea')+'</p></div> <div data-icon="g" ></div> </li>').appendTo(aux);
			}
		});

		}
	}

	
	$('#res').append(aux);

	//listener de items
	$('.item').on('click', estacionenmapa);
},800);
}

function estacionenmapa()
{
	var tit=$(this).children('.info').children('.titulo').text();
	
	//var tit=$(this).children('.info').children('.titulo').text();
	
	$('#res').html('');
	$('header').html('');
	$('<div class="'+$(this).attr('data-ecolor')+'" ></div>').appendTo('header');
	$('<img src="'+$(this).children('img').attr('src') +'" /> <h2 > '+tit+'</h2>').appendTo('header div');
	
	it();

	if(localStorage.offline!=1)
		{
			mapa_offline($(this).attr('data-red').replace(' ',''));
			sigueoff(this, tit);
		}
	else if(localStorage.offline==1)
			mapa_online(this);
	
	
	//listener de touch
	$('.marco').on('touchstart', tstart);
	$('.marco').on('touchmove', tmove);

}

function sigueoff(este, tit)
{
	$('#res .marco svg').find('path').each(function(i){
		console.log(tit+'_'+$(este).attr('data-estacion'));
		if($(este).attr('data-estacion')==tit.toLowerCase())
		{
			$(este).attr('fill', '#0472B8');
			zoom(este);
			console.log($(este).position().top);
			return false;
		}
			
	});
}

function zoom(m)
{
	/*var t=parseInt(($(m).offset().top)/(-3));
	console.log(t);
	$('#zoom').attr('transform', 'scale(2) translate(0,'+t+')');
	*/
	var t1=$('#res .marco').offset().top;
	var t2=$(m).offset().top;
	var medio=t1+(parseInt($('.marco').css('height'))/2);
	var t;

	if(t2<medio)
	{
		t=medio-t2-20;
	}
	else if(t2>medio)
	{
		t=t2-medio+40;
		t=t*(-1);
	}
		$('#zoom').attr('transform', 'scale(2) translate(0,'+t+')');

}

function tstart()
{
	event.preventDefault();
	touchinX=event.targetTouches[0].clientX;
	touchinY=event.targetTouches[0].clientY;
	console.log(event);
}

function tmove()
{
	alert(event);
	event.preventDefault();
	var despX=(touchinX-event.targetTouches[0].clientX)*(-1);
	var despY=(touchinY-event.targetTouches[0].clientY)*(-1);

		$('#zoom').attr('transform', 'scale(2) translate('+despX+','+despY+')');

}

$(document).ready(inicio);


//**quita acentos*/
 String.prototype.removeAccents = function ()

{

	var __r = 

	{

		'À':'A','Á':'A','Â':'A','Ã':'A','Ä':'A','Å':'A','Æ':'E',

		'È':'E','É':'E','Ê':'E','Ë':'E',

		'Ì':'I','Í':'I','Î':'I',

		'Ò':'O','Ó':'O','Ô':'O','Ö':'O',

		'Ù':'U','Ú':'U','Û':'U','Ü':'U',

		'Ñ':'N'

	};

	

	return this.replace(/[ÀÁÂÃÄÅÆÈÉÊËÌÍÎÒÓÔÖÙÚÛÜÑ]/gi, function(m)

	{

		var ret = __r[m.toUpperCase()];



		if (m === m.toLowerCase())

			ret = ret.toLowerCase();



		return ret;

	});

};

function mbocultar()
{

	$('#ocultamenu').fadeIn();
	$('#ocultamenu').on('click', function(){
		$('#ocultamenu').fadeOut();
	});
}

function it()
{
	$('#bar').show();
	$('#ocultamenu').fadeOut();
	$('#ruta').on('touchstart', geolocate);//geolocation
}

function geolocate()
{
	if("geolocation" in navigator)
	{//alert('va a entrar a geolocation');
		navigator.geolocation.getCurrentPosition(successmap, errormap);
	}
	else
	{
		alert('no soportado');
	}	
}

