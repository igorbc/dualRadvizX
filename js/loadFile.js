/**
 * Created by igorcorrea on 03/12/2015.
 */

function handleFile(files) {
    if(files != undefined){
        console.log(files[0]);
        var fileUrl;
        fileUrl = window.URL.createObjectURL(files[0]);
        sa.destroyCurrent();
        startRadviz(fileUrl);

    }
}
