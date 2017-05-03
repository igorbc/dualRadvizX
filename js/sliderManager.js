 configSlider = function(sliderConfigured){
    if(sliderConfigured != true)
        d3.select("#classContribSlider").call(contribSlider);

    return true;
}

onSlideFunction = function(evt, value) {
    vc.acClass.contribution = 1 - value / 100;
    vc.acAttr.contribution = 1 + value / 100;

    var cContr = vc.acClass.contribution / (vc.acClass.contribution + vc.acAttr.contribution);
    var aContr = vc.acAttr.contribution / (vc.acClass.contribution + vc.acAttr.contribution);

    vc.acAttr.normalizedContribution = aContr;
    vc.acClass.normalizedContribution = cContr;

    d3.select("#contribution")
            .text("Class: " + Math.round(cContr * 100) + "% / Attributes: " + Math.round(aContr * 100) + "%");

    vc.acAttr.updateAvApPositionOnScreen();
    vc.acClass.updateAvApPositionOnScreen();
    vc.updateInst();
}

contribSlider = d3.slider().min(-100).max(100).value(100)
        .on("slide", onSlideFunction);
