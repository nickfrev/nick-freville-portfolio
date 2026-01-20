//File system - a simple file manager

file_root = new Array();
//settup the base file system
file_root["bin"] = new Array();
file_root["bin"]["test"] = new Array();
file_root["bin"]["testProg"] = "console.log(\"bonjour\")";
file_root["enrichment"] = new Array();
file_root["data"] = new Array();

file_curDirecPath = new Array();

function file_getFile(inPath) {
	var curDirec = file_root;
	for (var i = 0; i < inPath.length; i++) {
		if (curDirec.hasOwnProperty(inPath[i])) {
			curDirec = curDirec[inPath[i]];
		}
	}
	return curDirec;
}

function file_cdForward(inDir) {
	var cur = file_getFile(file_curDirecPath);
	if (cur.hasOwnProperty(inDir)) {
		if (typeof cur[inDir] == "string") {
			disp("<rgb(200,0,50)>ERROR: <rgb(0,150,100)>"+inDir+" is a program use the \"run\" command to execute it.");
			return false;
		}
		file_curDirecPath.push(inDir);
		return true;
	}
	//disp("<rgb(200,0,50)>ERROR: <rgb(0,150,100)>"+inDir+" is not an existing directory.");
	return false;
}

function file_cdBackward() {
	file_curDirecPath.pop();
}

function file_makeDir(inDir) {
	file_getFile(file_curDirecPath)[inDir] = new Array();
}

//ls systex - prints the current directory
function file_ls(args) {
	var curDirec = file_getFile(file_curDirecPath);
	for (var key in curDirec) {
		if (typeof curDirec[key] == "string") {
			disp("<rgb(100,255,100)>"+key);
		} else {
			disp(key);
		}
	}
	disp("<rgb(255,255,255)>root/"+String(file_curDirecPath).replace(",", "/"));
	sys_clearNextInput = true;
	return true;
}
systexRegister("ls",file_ls);

//cd systex - travels to the directory
function file_cd(args) {
	var addPath = args[1].split("/");
	for (var i = 0; i < addPath.length; i++) {
		if (addPath[i] == "..") {
			file_cdBackward();
		} else {
			if (!file_cdForward(addPath[i])) {
				break;
			}
		}
	}	
	file_ls();
	
	sys_clearNextInput = true;
	return true;
}
systexRegister("cd",file_cd);

//mkDir systex - make a new directory
function file_mkDir(args) {
	var curDir = file_getFile(file_curDirecPath);
	var addPath = args[1].split("/");
	for (var i = 0; i < addPath.length; i++) {
		if (curDir.hasOwnProperty(addPath[i])) {
			file_cdForward(addPath[i]);
		} else {
			file_makeDir(addPath[i]);
			file_cdForward(addPath[i]);
		}
	}	
	file_ls();
	sys_clearNextInput = true;
	return true;
}
systexRegister("mkdir",file_mkDir);

//run systex - runs a program
function file_run(args) {
	var curDirec = file_getFile(file_curDirecPath);
	if (args.length < 2) {
		disp("<rgb(200,0,50)>ERROR: <rgb(0,150,100)> Proper use of <rgb(255,150,100)>\"run\"<rgb(0,150,100)> needs a file argument.");
		return true;
	}
	var key = args[1];
	if (curDirec.hasOwnProperty(key)) {
		if (typeof curDirec[key] == "string") {
			eval(curDirec[key]);
			return true;
		}
		disp("<rgb(200,0,50)>ERROR: <rgb(0,150,100)>"+key+" is a not a program.");
	}
	disp("<rgb(200,0,50)>ERROR: <rgb(0,150,100)>"+key+" is an element of this directory.");
	sys_clearNextInput = true;
	return true;
}
systexRegister("run",file_run);

