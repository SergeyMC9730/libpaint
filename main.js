var someinfo = []
var freeimgn = 0

var fs = require('fs')
var libb = require('./lib')
var figures = require('./obj')
var getpainting = (uid = 0, id = 0) => {
    try {
        fs.readFileSync(`./libpaint/savefiles/${id}.pntng`).toString('hex')
    } catch (e){
        return {error: "File Not Found", code: 404}
    }
    var painting = fs.readFileSync(`./libpaint/savefiles/${id}.pntng`).toString('hex')
    var info = {
        name: "",
        author: "",
        paint: "",
        raw: [],
	temp: "",
        tries: 0
    }
    var temp2 = libb.getbytes(painting)
    temp2[0].forEach((a) => {
        if(a == "00") info.tries++
        if(info.tries == 0) info.name += a
        if(info.tries == 1) info.author += a
        if(info.tries == 2) info.paint += a  
    })
    info.author = info.author.substring(2)
    info.paint = info.paint.substring(2)

    info.author = new Buffer.from(info.author, "hex").toString("utf-8")
    info.name = new Buffer.from(info.name, "hex").toString("utf-8")
    
    info.raw = libb.getbytes(info.paint)


    
    return info
}
var renderpaint = (bytearray = "", pointer = [0, 0], p = false, am = false) => {
    var white = ":white_large_square:"
    var black = ":black_large_square:"
    var redcl = ":red_square:"
	var green = ":green_square:"
	var bluec = ":blue_square:"
	
	var point = ":red_circle:"
	var brown = ":brown_square:"
	var orang = ":orange_square:"
	var purpl = ":purple_square:"
	var yellw = ":yellow_square:"
	var unknw = ":question:"


    var i = 0;
    var i2 = 0
    var ba = bytearray
	ba = libb.getbytes(ba);
	ba = libb.mergebytes(ba[0])
    ba = bytearray.match(/.{16}/g)

    ba.forEach((a = "") => {
        a = libb.getbytes(a, false)
        ba[i] = a
        i++
    })

    if(!p) ba[pointer[0]][pointer[1]] = "ff"

    i = 0
    i2 = 0

	
    ba.forEach((a) => {
        a.forEach((b = "") => {
		switch(b) {
			case "0f": b = (!am) ? white : ' -'; break; //white
			case "f0": b = (!am) ? black : ' 1'; break; //black
			case "30": b = (!am) ? redcl : ' r'; break; //red
			case "31": b = (!am) ? green : ' g'; break; //green
			case "32": b = (!am) ? bluec : ' b'; break; //blue
			case "33": b = (!am) ? brown : ' w'; break; //brown
			case "34": b = (!am) ? orang : " a"; break; //orange
			case "35": b = (!am) ? purpl : " p"; break; //purple
			case "36": b = (!am) ? yellw : " y"; break; //yellow
			case "ff": b = (!am) ? point : ' q'; break; //pointer
			default:   b = (!am) ? unknw : ' ?'; break; //unknown
		}
            ba[i][i2] = b
            i2++
            if(i2 == 8) i2 = 0
        })
        i++
    })

    var res = "> "
    
    ba.forEach((a) => {
        a.forEach((b = "") => {
            res += b
        })
        res += (!am) ? "\n> " : "  <\n> "
    })

	res = res.substring(0, res.length - 2);

	var res2 = ""
	if(am) res2 = `**\n\`\`\`\n${res}\`\`\`\n**`

    return (!am) ? res : res2
}

var savepaint = (uid, id, raw, info = [], isAlreadyAdded = false) => {
	var raw2 = ""
	if(!isAlreadyAdded) raw2 = `${new Buffer.from(info[0], 'utf8').toString('hex')}00${new Buffer.from(info[1], 'utf8').toString('hex')}00${raw}`
	if(isAlreadyAdded) raw2 = raw
    var data = new Buffer.from(raw2, 'hex')
    fs.writeFileSync(`./paint/savefiles/${id}.pntng`, data)
}

var convertpaint = () => {
	return 2021 // TODO сделать функцию (если потребуется)
}
var includesP = (p) => {
	try {
		fs.readFileSync(`./libpaint/savefiles/${p}.pntng`)
		return true
	} catch (err) {
		return false
	}
}

var getuserpaintings = (uid) => {
    try {
        fs.readFileSync("./libpaint/savefiles/list.json")
    } catch (e) {
        return {error: "File Not Found", code: 404}
    }
    var list = JSON.parse(fs.readFileSync("./libpaint/savefiles/list.json").toString('utf8'))
    return list[uid]
}

var iserr = (ret) => {
    if(ret.code > 0) {
        return 1
    } else return 0
}

var savefs = {
	list: {
		rsvdt: () => { //read save data
			return JSON.parse(fs.readFileSync("./libpaint/savefiles/list.json").toString('utf8'))
		},
		wsvdt: (sfs) => { //write save data
			fs.writeFileSync("./libpaint/savefiles/list.json", JSON.stringify(sfs))
		}
	},
	user: {
		rsvdt: () => { //read save data
			return JSON.parse(fs.readFileSync("./libpaint/savefiles/users.json").toString('utf8'))
		},
		wsvdt: (ufs) => { //write save data
			fs.writeFileSync("./libpaint/savefiles/users.json", JSON.stringify(ufs))
		}	
	}
}

var createuserdata = (uid) => {
	var sfs = savefs.list.rsvdt()
	sfs[uid] = []
	savefs.list.wsvdt(sfs)
	
	sfs = savefs.user.rsvdt()
	sfs.push(uid)
	savefs.user.wsvdt(sfs)
	return savefs.list.rsvdt()[uid]
}

var initimgnumb = () => {
	var ufs = savefs.user.rsvdt()
	someinfo = []
	
	ufs.forEach((a) => {
		var b = getuserpaintings(a)
		b.forEach((c) => {
			someinfo.push(c)
		})
	})
	
	freeimgn = someinfo.length + 1
}

var addheader = (author = "", description = "") => {
	var hauthor = new Buffer.from(author, 'utf8').toString("hex")
	var hdescription = new Buffer.from(description, 'utf8').toString("hex")
	var bytes = []
	
	libb.getbytes(hauthor).forEach((a) => {
		bytes.push(a)
	})
	bytes.push("00")
	libb.getbytes(hdescription).forEach((a) => {
		bytes.push(a)
	})
	bytes.push("00")
	
	return bytes
}

var createblankimg = (author = "", description = "", uid = "") => {
	var hauthor = new Buffer.from(author, 'utf8').toString("hex")
	var hdescription = new Buffer.from(description, 'utf8').toString("hex")
	var bytes = []
	var bytes3 = []
	
	libb.getbytes(hauthor).forEach((a) => {
		bytes.push(a)
	})
	bytes.push("00")
	libb.getbytes(hdescription).forEach((a) => {
		bytes.push(a)
	})
	bytes.push("00")
	
	var i = 0 
	var i2 = (64 + 8) - 1
	while(i < i2) {
		bytes.push("0f")
		bytes3.push("0f")
		i++
	}
	var bytes2 = libb.mergebytes(bytes)
	
	initimgnumb()
	savepaint(freeimgn, uid, bytes2.bytestring, [author, description], true)
	var sfs = savefs.list.rsvdt()
	sfs[uid].push(freeimgn)
	var id = freeimgn
	savefs.list.wsvdt(sfs)
	initimgnumb()
	
	var res = ""
	
	bytes3.forEach((a) => {
		res += a
	})
	
	return {
		id: id,
		image: {
			header: addheader(author, description),
			bytearray: bytes3,
			bytestring: res
		}
		
	}
}


var draw = (point = [0, 0], pixcl = "0f", imgpx = ['0f', '0f']) => {
	var ba = libb.mergebytes(imgpx).bytestring.match(/.{16}/g);
	var temp = []
	var i = 0
	var i2 = 0

	ba.forEach((a = "") => {
		a = libb.getbytes(a, false)
		ba[i] = a
		i++
	})
	ba[point[0]][point[1]] = pixcl
	ba.forEach((a) => {
		a.forEach((b = "") => {
			temp.push(b)
			i2++
			if(i2 == 8) i2 = 0
		})
		i++
	})
	imgpx = temp
	return imgpx
}
var getm = (imgpx = ['0f', '0f']) => {
	var ba = libb.mergebytes(imgpx).bytestring.match(/.{16}/g);
	var i = 0

	ba.forEach((a = "") => {
		a = libb.getbytes(a, false)
		ba[i] = a
		i++
	})
	return ba
}
var getp = (pointer = [0, 0], imgpx = ['0f', '0f']) => {
	return getm(imgpx)[pointer[0], pointer[1]]
}
var setm = (matrix) => {
	var temp = []
	matrix.forEach((a) => {
		a.forEach((b = "") => {
			temp.push(b)
			i2++
			if(i2 == 8) i2 = 0
		})
		i++
	})
	return temp
}
var donthg = () => {
	return 0;
}
var draf = (figt = 0, imgpx = ['0f', '0f'], pointer = [0, 0]) => {
	//EXPERIMENTAL FEATURE
	//EXPERIMENTAL FEATURE
	//EXPERIMENTAL FEATURE

	var finalxy = [0, 0]
	var matrix = getm(imgpx)
	switch(figt){
		case 0x00: //box micro
			figures.boxes.bmicro.forEach((xy) => {
				finalxy[0] = pointer[0] + xy[0]
				finalxy[1] = pointer[0] + xy[1]
				if(finalxy[0] > 7 || finalxy[1] > 7) {
					donthg()
				} else {
					matrix[finalxy[0], finalxy[1]] = "f0"
				}
			})	
			break;
		case 0x01: //box small
			figures.boxes.bsmall.forEach((xy) => {
				finalxy[0] = pointer[0] + xy[0]
				finalxy[1] = pointer[0] + xy[1]
				if(finalxy[0] > 7 || finalxy[1] > 7) {
					donthg()
				} else {
					matrix[finalxy[0], finalxy[1]] = "f0"
				}
			})	
			break;
		case 0x02: //box big
			figures.boxes.bbig.forEach((xy) => {
				finalxy[0] = pointer[0] + xy[0]
				finalxy[1] = pointer[0] + xy[1]
				if(finalxy[0] > 7 || finalxy[1] > 7) {
					donthg()
				} else {
					matrix[finalxy[0], finalxy[1]] = "f0"
				}
			})	
			break;
		case 0x10: //circle micro
			figures.circles.cmicro.forEach((xy) => {
				finalxy[0] = pointer[0] + xy[0]
				finalxy[1] = pointer[0] + xy[1]
				if(finalxy[0] > 7 || finalxy[1] > 7) {
					donthg()
				} else {
					matrix[finalxy[0], finalxy[1]] = "f0"
				}
			})	
			break;
		case 0x11: //circle small
			figures.circle.csmall.forEach((xy) => {
				finalxy[0] = pointer[0] + xy[0]
				finalxy[1] = pointer[0] + xy[1]
				if(finalxy[0] > 7 || finalxy[1] > 7) {
					donthg()
				} else {
					matrix[finalxy[0], finalxy[1]] = "f0"
				}
			})	
			break;
		case 0x12: //circle big
			figures.circle.cbig.forEach((xy) => {
				finalxy[0] = pointer[0] + xy[0]
				finalxy[1] = pointer[0] + xy[1]
				if(finalxy[0] > 7 || finalxy[1] > 7) {
					donthg()
				} else {
					matrix[finalxy[0], finalxy[1]] = "f0"
				}
			})	
			break;
	}
	matrix.forEach((a) => {
		fs.writeFileSync("test.txt", a)
	})
	return null
}

module.exports = {
	paint: {
		getpainting: getpainting,
		renderpaint: renderpaint,
		savepaint: savepaint,
		convertpaint: convertpaint,
		createblankimg: createblankimg,
		addheader: addheader,
		incp: includesP,
		pixels: {
			draw: draw,
			getm: getm,
			getp: getp,
			draf: draf
		},
		figures: figures
	},
	user: {
		getuserpaintings: getuserpaintings,
		createuserdata: createuserdata
	},
	fs: savefs,
	system: {
		initimgnumb: initimgnumb,
		paintlibinfo: [someinfo, freeimgn],
		iserr: iserr
	},
	extended: {
		getbytes: libb.getbytes,
		isnan: libb.isnan,
		mergebytes: libb.mergebytes,
		donthg: donthg
	}
}
var print_success = false;
if(print_success) console.log("Loaded PaintEngine Library!")
