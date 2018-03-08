    (function ( $ ) {
 
        $.fn.matrixchart = function(options) {
            this.each(function(){

            var settings = $.extend({
                // These are the defaults.
                height: 500,
                width: 500,
                noOfxLevels:5,
                noOfyLevels:5,
                xlabels: ['X1', 'X2', 'X3', 'X4', 'X5'],
                ylabels: ['Y1', 'Y2', 'Y3', 'Y4', 'Y5'],
                xAxisName:"X",
                yAxisName:"Y",
                matrixDatas : [],
                HSBhStart: 0,
                HSBhEnd: 161,
                valuepocketHeight:48,
                valuepocketwidth:96,
                xAxisIcon:"l",
                yAxisIcon:"j",
            }, options );

            // Color values for levels
            HSVsValue = 78;
            HSVvValue = 88;
            xcellsize=100/settings.noOfxLevels;
            ycellsize=100/settings.noOfyLevels;

            initialStarth = settings.HSBhStart;
            initialEndh = settings.HSBhEnd;
            xcolordivision = (initialEndh - initialStarth) / settings.noOfxLevels;
            ycolordivision = (initialEndh - initialStarth) / settings.noOfyLevels;
        
            //create axis point-levels
            // for-xlevels
            var xlevelpoints = "";
            for (var i=1;i<=settings.noOfxLevels; i++){
                xlevelColor =  HSVtoRGB(initialStarth + ((i-1) * xcolordivision),HSVsValue,HSVvValue);
                xlevelpoints += '<div class="axis-point-level level-'+i+'" style="width:'+xcellsize+'%"><span style="background: rgb('+xlevelColor[0]+','+xlevelColor[1]+','+xlevelColor[2]+')">'+i+'</span><p>'+settings.xlabels[i-1]+'</p></div>';
            }

            // for-ylevels
            var ylevelpoints = "";
            for (var i=1;i<=settings.noOfyLevels; i++){
                ylevelColor =  HSVtoRGB(initialStarth + ((i-1) * ycolordivision),HSVsValue,HSVvValue);
                ylevelpoints += '<div class="axis-point-level level-'+i+'" style="height:'+ycellsize+'%"><span style="background: rgb('+ylevelColor[0]+','+ylevelColor[1]+','+ylevelColor[2]+')">'+i+'</span><p>'+settings.ylabels[i-1]+'</p></div>';                
            }

            // matrixchart the collection based on the settings variable.
            var matrixmark = "";
            matrixmark+= '<div class="matrix" style="height:'+settings.height+'px;width:'+parseInt(parseInt(settings.width)+1)+'px;background-size:'+xcellsize + '% '+ ycellsize +'%">';                     
            matrixmark+= '<span class="axis-level y-axis-level"><span class="pepal_performance_icon">'+settings.xAxisIcon+'</span>'+settings.yAxisName+'</span>'; 
            matrixmark+= '<span class="axis-level x-axis-level"><span class="pepal_performance_icon">'+settings.yAxisIcon+'</span>'+settings.xAxisName+'</span>'; 
            matrixmark+= '<div class="main-axis y-axis"></div>';
            matrixmark+= '<div class="main-axis x-axis"></div>';
            matrixmark+= '<div class="axis-points y-axis-points">'+ylevelpoints+'</div>';
            matrixmark+= '<div class="axis-points x-axis-points" style="margin-left:'+ xcellsize / 2+'%">'+xlevelpoints+'</div>';
            
            for (var xaxis=1;xaxis<=settings.noOfxLevels; xaxis++){
                for(var yaxis=1;yaxis<=settings.noOfyLevels; yaxis++){
                    matrixmark+= '<div class="value-pocket value-'+xaxis+'-'+yaxis+'" style="height:'+settings.valuepocketHeight+';width:'+settings.valuepocketwidth+'px;left:calc('+xcellsize+'% * '+xaxis+' - '+settings.valuepocketHeight+'px);bottom:calc('+ycellsize+'% * '+yaxis+' - '+settings.valuepocketHeight/2+'px)"><ul></ul></div>'; 
                }              
            }                  
            
            // close matrix div
            matrixmark+='</div>';
            $(this).html(matrixmark);


            // Pocket datas manipulation 
            $.each(settings.matrixDatas, function(index, value){
                var element = $('.value-pocket.value-'+value.pocketAxisValue.x+'-'+value.pocketAxisValue.y).find('ul');
                var children = element.children().length;
                if(children < 2){
                    element.append('<li><img src="'+value.image+'"/></li>');
                }else if(children == 2){
                    element.append('<li><span class="more">2</span></li>');
                }else if(children > 2){
                    element.find('.more').addClass('displayed');
                }
                var previousCount = element.find('.more').text();
                element.find('.more').addClass('displayed').text(parseInt(parseInt(previousCount)+1));
            });
            
            return this;
        });
        };

    // HSV to RGB Converter
    function HSVtoRGB(h, s, v) {
    var r, g, b;
    var i;
    var f, p, q, t;
     
    // Make sure our arguments stay in-range
    h = Math.max(0, Math.min(360, h));
    s = Math.max(0, Math.min(100, s));
    v = Math.max(0, Math.min(100, v));
     
    // We accept saturation and value arguments from 0 to 100 because that's
    // how Photoshop represents those values. Internally, however, the
    // saturation and value are calculated from a range of 0 to 1. We make
    // That conversion here.
    s /= 100;
    v /= 100;
     
    if(s == 0) {
        // Achromatic (grey)
        r = g = b = v;
        return [
            Math.round(r * 255), 
            Math.round(g * 255), 
            Math.round(b * 255)
        ];
    }
     
    h /= 60; // sector 0 to 5
    i = Math.floor(h);
    f = h - i; // factorial part of h
    p = v * (1 - s);
    q = v * (1 - s * f);
    t = v * (1 - s * (1 - f));
     
    switch(i) {
        case 0:
            r = v;
            g = t;
            b = p;
            break;
     
        case 1:
            r = q;
            g = v;
            b = p;
            break;
     
        case 2:
            r = p;
            g = v;
            b = t;
            break;
     
        case 3:
            r = p;
            g = q;
            b = v;
            break;
     
        case 4:
            r = t;
            g = p;
            b = v;
            break;
     
        default: // case 5:
            r = v;
            g = p;
            b = q;
    }
     
    returnValue = [
        Math.round(r * 255), 
        Math.round(g * 255), 
        Math.round(b * 255)
    ];
    return returnValue;
        }
    }( jQuery ));