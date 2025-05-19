var T= Nenge,I=T.I,F=T.F;
var Module = {};
(async function(){

    let files = await T.FetchItem({
        url:'cores/arcade-wasm.7z?'+T.time,
        unpack:!0
    });
    let games = await T.FetchItem({
        url:'/xiunoII/game/kof97.zip',
    });
    let bios = await T.FetchItem({
        url:'bios/arcade.7z',
        unpack:!0
    });
    console.log(files,games,game);
    files['retroarch.js'] = I.decode(files['retroarch.js']).replace(/function\s*_gettimeofday\(ptr\)\s*\{\n?\s*?var\s*now\s*=\s*/,'function _gettimeofday(ptr) {var now = 1690674045574;').replace(/function\s*callMain\(args\)\s*{/,'function callMain(args) {if(typeof args==="string"){args = ["-v",args,"c37f5e84f377fb892c851b364c55251132d57c66d2f3ea56d2af90bef14773f0"];}console.log(args);');
    await T.addJS(files['retroarch.js']);
    //await T.addJS('./gb.js?'+T.time);
    Module = {
        wasmBinary : files['retroarch.wasm'],
        canvas:T.$('canvas'),
        hash:'2b35cacf70aef5cbb3f38c0bb20e488cc8ad0c350400499a0',
        onRuntimeInitialized(){
            let args = 'kof97.zip';
            I.toArr(bios,v=>this.writeFile(v[0],v[1]));
            this.writeFile(args,games);
            if(this.specialHTMLTargets){
                I[1].assign(this.specialHTMLTargets,{
                    '#canvas':this.canvas,
                    '#canvas-input':T.$('#ejs-input'),
                    '#canvas-mouse':T.$('#game')
                });
            }
            /*
            if(this._get_content_crc){
                    T.$('iframe').src = 'https://www.emulatorjs.com/embed/load.html';
                    T.once(window,'message',e=>{
                        console.log(e.data);
                        if(e.data.key)args[2] = e.data.key;
                    });
            }
            */
            this.mkdir('/etc');
            this.mkdir('/home');
            this.mkdir('/shader');
            this.mkdir('/saves');
            this.mkdir('/home/web_user/.config');
            this.mkdir('/home/web_user/retroarch/userdata');
            //this.mkdir('/home/web_user/retroarch/userdata/config/remaps/mGBA');
            //this.writeFile('/etc/Gambatte/Gambatte.cfg','gambatte_gb_bootloader = "enabled"\ngambatte_gb_colorization = GBA\ngambatte_gb_hwmode = GBA')
            this.writeFile('/etc/retroarch.cfg', 'savefile_directory = "/saves"' +
            '\nsystem_directory = "/"\n' +
            '\nsavestate_directory = "/saves"' +
            '\nvideo_vsync = true' +
            '\nscreenshot_directory = "/"' +
            '\nvideo_shader = "/shader/shader.glslp"' +
            '\nvideo_shader_enable = true' +
            '\nvideo_font_enable = false' +
            '\nvideo_scale = 1.0' +
            '\nvideo_gpu_screenshot = false' +
            '\ncamera_allow = "false"' +
            '\ncamera_driver = "null"' +
            '\ncamera_device = "null"'+
            '\n');
            T.once(T.$('canvas'),'click',async e=>{
                //let headers = (await T.FetchItem({url:'https://www.emulatorjs.com/api/v?name=gb',type:'head'}));
                //a75d7994cbfc3bfd7f61c328e42a064d7d4c43e0f2069d6c85ff2c6517f6403f
                //console.log(headers);
                //if(headers.key)args[2] = headers.key;
                if(Module._get_content_crc){
                    args[2] = 'c8b683b2e3b8417696ca6026b160c7a332d57c66d2f3ea56d2af90bef14773f0';
                    //54f99f60901cd32e55c5ef323c27d0e2 32d57c66d2f3ea56d2af90bef14773f0
                    //54f99f60901cd32e55c5ef323c27d0e232d57c66d2f3ea56d2af90bef14773f0
                }
                Module.callMain(args);
                console.log('click',args,Module.getCore());

            })
            console.log('ok');
        },
        'TOTAL_MEMORY': 0x10000000,
        'noInitialRun': !0x0,
        'arguments': [],
        'preRun': [],
        'postRun': [],
        'totalDependencies': 0x0,
        print(e){
            console.log(e);
        },
        printErr(e){
            console.log(e);
        },
        inputValue(...a){
            return this['cwrap']('simulate_input', 'null', ['number', 'number', 'number'])(...a);
        },
        setVariable(...a){
            return this['cwrap']('set_variable', 'null', ['string', 'string']).apply(this,a);
        },
        getCore(){
            let data = this['cwrap']('get_core_options', 'string', [])();
            if(data){
                let list = data.split('\n');
                return Object.fromEntries(
                list.map(v=>{
                    let s = v.split(';');
                    return [s[0],s[1]&&s[1].trim().split('|').map(v=>v.trim())];
                }));
            }
        },
        readFile(name){
            return I.decode(this.FS.readFile(name))
        },
        mkdir(path){
            let FS = this.FS;
            if(!FS.analyzePath(path).exists){
                let p = path.split('/');
                let name = p.pop();
                let newpath = p.join('/');
                this.mkdir(newpath);
                FS.createPath(newpath, name, !0x0, !0x0);
            }
        },
        writeFile(path,data){
            let newpath = path.split('/').slice(0,-1).join('/');
            newpath&&this.mkdir(newpath);
            this.FS.writeFile(path,data);


        },
    };
    EmulatorJS_(Module);
})()