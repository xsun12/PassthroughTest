var fsSync = null;
const loop=20;
function initFS() {
postMessage(this.TEMPORARY);
postMessage(this.PERSISTENT);
postMessage(this.EXTERNAL);
fsSync = webkitRequestFileSystemSync(this.EXTERNAL, 1024*1024 );
postMessage(fsSync.root.isFile);
postMessage(fsSync.root.isDirectory);
}


// Initiate filesystem on page load.
initFS();
//postMessage('Got file system.');
if ( !fsSync) {
//	alert("empty filesystem!");
    postMessage("Failed to request external filesystem!");
    return;
}

{
    onmessage = function(e) {
    
    postMessage("dataDir");
    dataDir = fsSync.root.getDirectory("Documents", {create: true});
    postMessage("secondDir");
    secondDir = dataDir.getDirectory("deeper", {create: true});
    postMessage("anotherDir");
    anotherDir = dataDir.getDirectory("another", {create: true});
    postMessage(filename);
    var sizeKB=e.data;
    var filename = "hello.txt";
    postMessage(filename);

    // Test that the URL we generate can be fed back in to resolve into
    // the original entry
    var entrySync = dataDir.getFile(filename, {create:true});
    var url = entrySync.toURL();
    postMessage(url);
    var resolvedEntry = webkitResolveLocalFileSystemSyncURL(url);
    postMessage("Resolved isFile = " + resolvedEntry.isFile);
    postMessage("Resolved isDirectory = " + resolvedEntry.isDirectory);
    postMessage("Resolved name = " + resolvedEntry.name);
    postMessage("Resolved fullPath = " + resolvedEntry.fullPath);
    postMessage("Resolved URL = " + resolvedEntry.toURL());

    // test write
    var fileWriter = entrySync.createWriter();
    //fileWriter.truncate(0);
    fileWriter.seek(entrySync.file().size);
    var builder = new WebKitBlobBuilder();
    //var testData = "test data\n";
    var testData = "";
    for(var i = 0; i < 32; i++)
       testData+="Hello Tizen!\n";
    builder.append(testData);
    var blob = builder.getBlob();

    //postMessage('Begin writing');    
    fileWriter.write(blob);

//Sync read file
    var readentrySync = dataDir.getFile(filename, {create: false, exclusive: false});
    var size=readentrySync.file().size;
    postMessage("File size = "+size);
    
    fileReaderSync = new FileReaderSync();
    var startDate = new Date();

    var fileText = fileReaderSync.readAsText(readentrySync.file());
    postMessage(fileText);

    var secondEntry = secondDir.getFile(filename, {create: true, exclusive: false});
    postMessage(secondEntry.toURL());

    secondEntry.moveTo(anotherDir, "newname.txt");
    postMessage(secondEntry.toURL());
    }
}
