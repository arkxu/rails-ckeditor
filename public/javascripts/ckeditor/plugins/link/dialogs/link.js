﻿/*
Copyright (c) 2003-2010, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.dialog.add('link',function(a){
    var b=CKEDITOR.plugins.link,c=function(){
        var C=this.getDialog(),D=C.getContentElement('target','popupFeatures'),E=C.getContentElement('target','linkTargetName'),F=this.getValue();
        if(!D||!E)return;
        D=D.getElement();
        D.hide();
        E.setValue('');
        switch(F){
            case 'frame':
                E.setLabel(a.lang.link.targetFrameName);
                E.getElement().show();
                break;
            case 'popup':
                D.show();
                E.setLabel(a.lang.link.targetPopupName);
                E.getElement().show();
                break;
            default:
                E.setValue(F);
                E.getElement().hide();
                break;
        }
    },d=function(){
        var C=this.getDialog(),D=['urlOptions','anchorOptions','emailOptions'],E=this.getValue(),F=C.definition.getContents('upload'),G=F&&F.hidden;
        if(E=='url'){
            if(a.config.linkShowTargetTab)C.showPage('target');
            if(!G)C.showPage('upload');
        }else{
            C.hidePage('target');
            if(!G)C.hidePage('upload');
        }
        for(var H=0;H<D.length;H++){
            var I=C.getContentElement('info',D[H]);
            if(!I)continue;
            I=I.getElement().getParent().getParent();
            if(D[H]==E+'Options')I.show();else I.hide();
        }
    },e=/^javascript:/,f=/^mailto:([^?]+)(?:\?(.+))?$/,g=/subject=([^;?:@&=$,\/]*)/,h=/body=([^;?:@&=$,\/]*)/,i=/^#(.*)$/,j=/^((?:http|https|ftp|news):\/\/)?(.*)$/,k=/^(_(?:self|top|parent|blank))$/,l=/^javascript:void\(location\.href='mailto:'\+String\.fromCharCode\(([^)]+)\)(?:\+'(.*)')?\)$/,m=/^javascript:([^(]+)\(([^)]+)\)$/,n=/\s*window.open\(\s*this\.href\s*,\s*(?:'([^']*)'|null)\s*,\s*'([^']*)'\s*\)\s*;\s*return\s*false;*\s*/,o=/(?:^|,)([^=]+)=(\d+|yes|no)/gi,p=function(C,D){
        var E=D&&(D.getAttribute('_cke_saved_href')||D.getAttribute('href'))||'',F,G,H,I,J={};

        if(F=E.match(e))if(y=='encode')E=E.replace(l,function(Z,aa,ab){
            return 'mailto:'+String.fromCharCode.apply(String,aa.split(','))+(ab&&w(ab));
        });
        else if(y)E.replace(m,function(Z,aa,ab){
            if(aa==z.name){
                J.type='email';
                var ac=J.email={},ad=/[^,\s]+/g,ae=/(^')|('$)/g,af=ab.match(ad),ag=af.length,ah,ai;
                for(var aj=0;aj<ag;aj++){
                    ai=decodeURIComponent(w(af[aj].replace(ae,'')));
                    ah=z.params[aj].toLowerCase();
                    ac[ah]=ai;
                }
                ac.address=[ac.name,ac.domain].join('@');
            }
        });
        if(!J.type)if(H=E.match(i)){
            J.type='anchor';
            J.anchor={};

            J.anchor.name=J.anchor.id=H[1];
        }else if(G=E.match(f)){
            var K=E.match(g),L=E.match(h);
            J.type='email';
            var M=J.email={};

            M.address=G[1];
            K&&(M.subject=decodeURIComponent(K[1]));
            L&&(M.body=decodeURIComponent(L[1]));
        }else if(E&&(I=E.match(j))){
            J.type='url';
            J.url={};

            J.url.protocol=I[1];
            J.url.url=I[2];
        }else J.type='url';
        if(D){
            var N=D.getAttribute('target');
            J.target={};

            J.adv={};

            if(!N){
                var O=D.getAttribute('_cke_pa_onclick')||D.getAttribute('onclick'),P=O&&O.match(n);
                if(P){
                    J.target.type='popup';
                    J.target.name=P[1];
                    var Q;
                    while(Q=o.exec(P[2])){
                        if(Q[2]=='yes'||Q[2]=='1')J.target[Q[1]]=true;
                        else if(isFinite(Q[2]))J.target[Q[1]]=Q[2];
                    }
                }
            }else{
                var R=N.match(k);
                if(R)J.target.type=J.target.name=N;
                else{
                    J.target.type='frame';
                    J.target.name=N;
                }
            }
            var S=this,T=function(Z,aa){
                var ab=D.getAttribute(aa);
                if(ab!==null)J.adv[Z]=ab||'';
            };

            T('advId','id');
            T('advLangDir','dir');
            T('advAccessKey','accessKey');
            T('advName','name');
            T('advLangCode','lang');
            T('advTabIndex','tabindex');
            T('advTitle','title');
            T('advContentType','type');
            T('advCSSClasses','class');
            T('advCharset','charset');
            T('advStyles','style');
        }
        var U=C.document.getElementsByTag('img'),V=new CKEDITOR.dom.nodeList(C.document.$.anchors),W=J.anchors=[];
        for(var X=0;X<U.count();X++){
            var Y=U.getItem(X);
            if(Y.getAttribute('_cke_realelement')&&Y.getAttribute('_cke_real_element_type')=='anchor')W.push(C.restoreRealElement(Y));
        }
        for(X=0;X<V.count();X++)W.push(V.getItem(X));
        for(X=0;X<W.length;X++){
            Y=W[X];
            W[X]={
                name:Y.getAttribute('name'),
                id:Y.getAttribute('id')
            };

        }
        this._.selectedElement=D;
        return J;
    },q=function(C,D){
        if(D[C])this.setValue(D[C][this.id]||'');
    },r=function(C){
        return q.call(this,'target',C);
    },s=function(C){
        return q.call(this,'adv',C);
    },t=function(C,D){
        if(!D[C])D[C]={};

        D[C][this.id]=this.getValue()||'';
    },u=function(C){
        return t.call(this,'target',C);
    },v=function(C){
        return t.call(this,'adv',C);
    };

    function w(C){
        return C.replace(/\\'/g,"'");
    };

    function x(C){
        return C.replace(/'/g,'\\$&');
    };

    var y=a.config.emailProtection||'';
    if(y&&y!='encode'){
        var z={};

        y.replace(/^([^(]+)\(([^)]+)\)$/,function(C,D,E){
            z.name=D;
            z.params=[];
            E.replace(/[^,\s]+/g,function(F){
                z.params.push(F);
            });
        });
    }
    function A(C){
        var D,E=z.name,F=z.params,G,H;
        D=[E,'('];
        for(var I=0;I<F.length;I++){
            G=F[I].toLowerCase();
            H=C[G];
            I>0&&D.push(',');
            D.push("'",H?x(encodeURIComponent(C[G])):'',"'");
        }
        D.push(')');
        return D.join('');
    };

    function B(C){
        var D,E=C.length,F=[];
        for(var G=0;G<E;G++){
            D=C.charCodeAt(G);
            F.push(D);
        }
        return 'String.fromCharCode('+F.join(',')+')';
    };

    return{
        title:a.lang.link.title,
        minWidth:350,
        minHeight:230,
        contents:[{
            id:'info',
            label:a.lang.link.info,
            title:a.lang.link.info,
            elements:[{
                id:'linkType',
                type:'select',
                label:a.lang.link.type,
                'default':'url',
                items:[[a.lang.link.toUrl,'url'],[a.lang.link.toAnchor,'anchor'],[a.lang.link.toEmail,'email']],
                onChange:d,
                setup:function(C){
                    if(C.type)this.setValue(C.type);
                },
                commit:function(C){
                    C.type=this.getValue();
                }
            },{
                type:'vbox',
                id:'urlOptions',
                children:[{
                    type:'hbox',
                    widths:['25%','75%'],
                    children:[{
                        id:'protocol',
                        type:'select',
                        label:a.lang.common.protocol,
                        'default':'http://',
                        items:[['http://‎','http://'],['https://‎','https://'],['ftp://‎','ftp://'],['news://‎','news://'],[a.lang.link.other,'']],
                        setup:function(C){
                            if(C.url)this.setValue(C.url.protocol||'');
                        },
                        commit:function(C){
                            if(!C.url)C.url={};

                            C.url.protocol=this.getValue();
                        }
                    },{
                        type:'text',
                        id:'url',
                        label:a.lang.common.url,
                        required:true,
                        onLoad:function(){
                            this.allowOnChange=true;
                        },
                        onKeyUp:function(){
                            var H=this;
                            H.allowOnChange=false;
                            var C=H.getDialog().getContentElement('info','protocol'),D=H.getValue(),E=/^(http|https|ftp|news):\/\/(?=.)/gi,F=/^((javascript:)|[#\/\.\?])/gi,G=E.exec(D);
                            if(G){
                                H.setValue(D.substr(G[0].length));
                                C.setValue(G[0].toLowerCase());
                            }else if(F.test(D))C.setValue('');
                            H.allowOnChange=true;
                        },
                        onChange:function(){
                            if(this.allowOnChange)this.onKeyUp();
                        },
                        validate:function(){
                            var C=this.getDialog();
                            if(C.getContentElement('info','linkType')&&C.getValueOf('info','linkType')!='url')return true;
                            if(this.getDialog().fakeObj)return true;
                            var D=CKEDITOR.dialog.validate.notEmpty(a.lang.link.noUrl);
                            return D.apply(this);
                        },
                        setup:function(C){
                            this.allowOnChange=false;
                            if(C.url)this.setValue(C.url.url);
                            this.allowOnChange=true;
                        },
                        commit:function(C){
                            this.onChange();
                            if(!C.url)C.url={};

                            C.url.url=this.getValue();
                            this.allowOnChange=false;
                        }
                    }],
                    setup:function(C){
                        if(!this.getDialog().getContentElement('info','linkType'))this.getElement().show();
                    }
                },{
                    type:'button',
                    id:'browse',
                    hidden:'true',
                    filebrowser:'info:url',
                    label:a.lang.common.browseServer
                }]
            },{
                type:'vbox',
                id:'anchorOptions',
                width:260,
                align:'center',
                padding:0,
                children:[{
                    type:'fieldset',
                    id:'selectAnchorText',
                    label:a.lang.link.selectAnchor,
                    setup:function(C){
                        if(C.anchors.length>0)this.getElement().show();else this.getElement().hide();
                    },
                    children:[{
                        type:'hbox',
                        id:'selectAnchor',
                        children:[{
                            type:'select',
                            id:'anchorName',
                            'default':'',
                            label:a.lang.link.anchorName,
                            style:'width: 100%;',
                            items:[['']],
                            setup:function(C){
                                var F=this;
                                F.clear();
                                F.add('');
                                for(var D=0;D<C.anchors.length;D++){
                                    if(C.anchors[D].name)F.add(C.anchors[D].name);
                                }
                                if(C.anchor)F.setValue(C.anchor.name);
                                var E=F.getDialog().getContentElement('info','linkType');
                                if(E&&E.getValue()=='email')F.focus();
                            },
                            commit:function(C){
                                if(!C.anchor)C.anchor={};

                                C.anchor.name=this.getValue();
                            }
                        },{
                            type:'select',
                            id:'anchorId',
                            'default':'',
                            label:a.lang.link.anchorId,
                            style:'width: 100%;',
                            items:[['']],
                            setup:function(C){
                                var E=this;
                                E.clear();
                                E.add('');
                                for(var D=0;D<C.anchors.length;D++){
                                    if(C.anchors[D].id)E.add(C.anchors[D].id);
                                }
                                if(C.anchor)E.setValue(C.anchor.id);
                            },
                            commit:function(C){
                                if(!C.anchor)C.anchor={};

                                C.anchor.id=this.getValue();
                            }
                        }],
                        setup:function(C){
                            if(C.anchors.length>0)this.getElement().show();else this.getElement().hide();
                        }
                    }]
                },{
                    type:'html',
                    id:'noAnchors',
                    style:'text-align: center;',
                    html:'<div role="label" tabIndex="-1">'+CKEDITOR.tools.htmlEncode(a.lang.link.noAnchors)+'</div>',
                    focus:true,
                    setup:function(C){
                        if(C.anchors.length<1)this.getElement().show();
                        else this.getElement().hide();
                    }
                }],
                setup:function(C){
                    if(!this.getDialog().getContentElement('info','linkType'))this.getElement().hide();
                }
            },{
                type:'vbox',
                id:'emailOptions',
                padding:1,
                children:[{
                    type:'text',
                    id:'emailAddress',
                    label:a.lang.link.emailAddress,
                    required:true,
                    validate:function(){
                        var C=this.getDialog();
                        if(!C.getContentElement('info','linkType')||C.getValueOf('info','linkType')!='email')return true;
                        var D=CKEDITOR.dialog.validate.notEmpty(a.lang.link.noEmail);
                        return D.apply(this);
                    },
                    setup:function(C){
                        if(C.email)this.setValue(C.email.address);
                        var D=this.getDialog().getContentElement('info','linkType');
                        if(D&&D.getValue()=='email')this.select();
                    },
                    commit:function(C){
                        if(!C.email)C.email={};

                        C.email.address=this.getValue();
                    }
                },{
                    type:'text',
                    id:'emailSubject',
                    label:a.lang.link.emailSubject,
                    setup:function(C){
                        if(C.email)this.setValue(C.email.subject);
                    },
                    commit:function(C){
                        if(!C.email)C.email={};

                        C.email.subject=this.getValue();
                    }
                },{
                    type:'textarea',
                    id:'emailBody',
                    label:a.lang.link.emailBody,
                    rows:3,
                    'default':'',
                    setup:function(C){
                        if(C.email)this.setValue(C.email.body);
                    },
                    commit:function(C){
                        if(!C.email)C.email={};

                        C.email.body=this.getValue();
                    }
                }],
                setup:function(C){
                    if(!this.getDialog().getContentElement('info','linkType'))this.getElement().hide();
                }
            }]
        },{
            id:'target',
            label:a.lang.link.target,
            title:a.lang.link.target,
            elements:[{
                type:'hbox',
                widths:['50%','50%'],
                children:[{
                    type:'select',
                    id:'linkTargetType',
                    label:a.lang.common.target,
                    'default':'notSet',
                    style:'width : 100%;',
                    items:[[a.lang.common.notSet,'notSet'],[a.lang.link.targetFrame,'frame'],[a.lang.link.targetPopup,'popup'],[a.lang.common.targetNew,'_blank'],[a.lang.common.targetTop,'_top'],[a.lang.common.targetSelf,'_self'],[a.lang.common.targetParent,'_parent']],
                    onChange:c,
                    setup:function(C){
                        if(C.target)this.setValue(C.target.type);
                    },
                    commit:function(C){
                        if(!C.target)C.target={};

                        C.target.type=this.getValue();
                    }
                },{
                    type:'text',
                    id:'linkTargetName',
                    label:a.lang.link.targetFrameName,
                    'default':'',
                    setup:function(C){
                        if(C.target)this.setValue(C.target.name);
                    },
                    commit:function(C){
                        if(!C.target)C.target={};

                        C.target.name=this.getValue().replace(/\W/gi,'');
                    }
                }]
            },{
                type:'vbox',
                width:260,
                align:'center',
                padding:2,
                id:'popupFeatures',
                children:[{
                    type:'fieldset',
                    label:a.lang.link.popupFeatures,
                    children:[{
                        type:'hbox',
                        children:[{
                            type:'checkbox',
                            id:'resizable',
                            label:a.lang.link.popupResizable,
                            setup:r,
                            commit:u
                        },{
                            type:'checkbox',
                            id:'status',
                            label:a.lang.link.popupStatusBar,
                            setup:r,
                            commit:u
                        }]
                    },{
                        type:'hbox',
                        children:[{
                            type:'checkbox',
                            id:'location',
                            label:a.lang.link.popupLocationBar,
                            setup:r,
                            commit:u
                        },{
                            type:'checkbox',
                            id:'toolbar',
                            label:a.lang.link.popupToolbar,
                            setup:r,
                            commit:u
                        }]
                    },{
                        type:'hbox',
                        children:[{
                            type:'checkbox',
                            id:'menubar',
                            label:a.lang.link.popupMenuBar,
                            setup:r,
                            commit:u
                        },{
                            type:'checkbox',
                            id:'fullscreen',
                            label:a.lang.link.popupFullScreen,
                            setup:r,
                            commit:u
                        }]
                    },{
                        type:'hbox',
                        children:[{
                            type:'checkbox',
                            id:'scrollbars',
                            label:a.lang.link.popupScrollBars,
                            setup:r,
                            commit:u
                        },{
                            type:'checkbox',
                            id:'dependent',
                            label:a.lang.link.popupDependent,
                            setup:r,
                            commit:u
                        }]
                    },{
                        type:'hbox',
                        children:[{
                            type:'text',
                            widths:['30%','70%'],
                            labelLayout:'horizontal',
                            label:a.lang.link.popupWidth,
                            id:'width',
                            setup:r,
                            commit:u
                        },{
                            type:'text',
                            labelLayout:'horizontal',
                            widths:['55%','45%'],
                            label:a.lang.link.popupLeft,
                            id:'left',
                            setup:r,
                            commit:u
                        }]
                    },{
                        type:'hbox',
                        children:[{
                            type:'text',
                            labelLayout:'horizontal',
                            widths:['30%','70%'],
                            label:a.lang.link.popupHeight,
                            id:'height',
                            setup:r,
                            commit:u
                        },{
                            type:'text',
                            labelLayout:'horizontal',
                            label:a.lang.link.popupTop,
                            widths:['55%','45%'],
                            id:'top',
                            setup:r,
                            commit:u
                        }]
                    }]
                }]
            }]
        },{
            id:'upload',
            label:a.lang.link.upload,
            title:a.lang.link.upload,
            hidden:true,
            filebrowser:'uploadButton',
            elements:[{
                type:'file',
                id:'upload',
                label:a.lang.common.upload,
                style:'height:40px',
                size:29
            },{
                type:'fileButton',
                id:'uploadButton',
                label:a.lang.common.uploadSubmit,
                filebrowser:{
                    action : 'QuickUpload',
                    target : 'info:url',
                    params : {
                        _htmless_session: _htmless_session,
                        authenticity_token: _htmless_token
                    }
                },
                'for':['upload','upload']
            }]
        },{
            id:'advanced',
            label:a.lang.link.advanced,
            title:a.lang.link.advanced,
            elements:[{
                type:'vbox',
                padding:1,
                children:[{
                    type:'hbox',
                    widths:['45%','35%','20%'],
                    children:[{
                        type:'text',
                        id:'advId',
                        label:a.lang.link.id,
                        setup:s,
                        commit:v
                    },{
                        type:'select',
                        id:'advLangDir',
                        label:a.lang.link.langDir,
                        'default':'',
                        style:'width:110px',
                        items:[[a.lang.common.notSet,''],[a.lang.link.langDirLTR,'ltr'],[a.lang.link.langDirRTL,'rtl']],
                        setup:s,
                        commit:v
                    },{
                        type:'text',
                        id:'advAccessKey',
                        width:'80px',
                        label:a.lang.link.acccessKey,
                        maxLength:1,
                        setup:s,
                        commit:v
                    }]
                },{
                    type:'hbox',
                    widths:['45%','35%','20%'],
                    children:[{
                        type:'text',
                        label:a.lang.link.name,
                        id:'advName',
                        setup:s,
                        commit:v
                    },{
                        type:'text',
                        label:a.lang.link.langCode,
                        id:'advLangCode',
                        width:'110px',
                        'default':'',
                        setup:s,
                        commit:v
                    },{
                        type:'text',
                        label:a.lang.link.tabIndex,
                        id:'advTabIndex',
                        width:'80px',
                        maxLength:5,
                        setup:s,
                        commit:v
                    }]
                }]
            },{
                type:'vbox',
                padding:1,
                children:[{
                    type:'hbox',
                    widths:['45%','55%'],
                    children:[{
                        type:'text',
                        label:a.lang.link.advisoryTitle,
                        'default':'',
                        id:'advTitle',
                        setup:s,
                        commit:v
                    },{
                        type:'text',
                        label:a.lang.link.advisoryContentType,
                        'default':'',
                        id:'advContentType',
                        setup:s,
                        commit:v
                    }]
                },{
                    type:'hbox',
                    widths:['45%','55%'],
                    children:[{
                        type:'text',
                        label:a.lang.link.cssClasses,
                        'default':'',
                        id:'advCSSClasses',
                        setup:s,
                        commit:v
                    },{
                        type:'text',
                        label:a.lang.link.charset,
                        'default':'',
                        id:'advCharset',
                        setup:s,
                        commit:v
                    }]
                },{
                    type:'hbox',
                    children:[{
                        type:'text',
                        label:a.lang.link.styles,
                        'default':'',
                        id:'advStyles',
                        setup:s,
                        commit:v
                    }]
                }]
            }]
        }],
        onShow:function(){
            var F=this;
            F.fakeObj=false;
            var C=F.getParentEditor(),D=C.getSelection(),E=null;
            if((E=b.getSelectedLink(C))&&E.hasAttribute('href'))D.selectElement(E);
            else if((E=D.getSelectedElement())&&E.is('img')&&E.getAttribute('_cke_real_element_type')&&E.getAttribute('_cke_real_element_type')=='anchor'){
                F.fakeObj=E;
                E=C.restoreRealElement(F.fakeObj);
                D.selectElement(F.fakeObj);
            }else E=null;
            F.setupContent(p.apply(F,[C,E]));
        },
        onOk:function(){
            var C={
                href:'javascript:void(0)/*'+CKEDITOR.tools.getNextNumber()+'*/'
            },D=[],E={
                href:C.href
            },F=this,G=this.getParentEditor();
            this.commitContent(E);
            switch(E.type||'url'){
                case 'url':
                    var H=E.url&&E.url.protocol!=undefined?E.url.protocol:'http://',I=E.url&&E.url.url||'';
                    C._cke_saved_href=I.indexOf('/')===0?I:H+I;
                    break;
                case 'anchor':
                    var J=E.anchor&&E.anchor.name,K=E.anchor&&E.anchor.id;
                    C._cke_saved_href='#'+(J||K||'');
                    break;
                case 'email':
                    var L,M=E.email,N=M.address;
                    switch(y){
                        case '':case 'encode':
                            var O=encodeURIComponent(M.subject||''),P=encodeURIComponent(M.body||''),Q=[];
                            O&&Q.push('subject='+O);
                            P&&Q.push('body='+P);
                            Q=Q.length?'?'+Q.join('&'):'';
                            if(y=='encode'){
                                L=["javascript:void(location.href='mailto:'+",B(N)];
                                Q&&L.push("+'",x(Q),"'");
                                L.push(')');
                            }else L=['mailto:',N,Q];
                            break;
                        default:
                            var R=N.split('@',2);
                            M.name=R[0];
                            M.domain=R[1];
                            L=['javascript:',A(M)];
                    }
                    C._cke_saved_href=L.join('');
                    break;
            }
            if(E.target)if(E.target.type=='popup'){
                var S=["window.open(this.href, '",E.target.name||'',"', '"],T=['resizable','status','location','toolbar','menubar','fullscreen','scrollbars','dependent'],U=T.length,V=function(ah){
                    if(E.target[ah])T.push(ah+'='+E.target[ah]);
                };

                for(var W=0;W<U;W++)T[W]=T[W]+(E.target[T[W]]?'=yes':'=no');
                V('width');
                V('left');
                V('height');
                V('top');
                S.push(T.join(','),"'); return false;");
                C._cke_pa_onclick=S.join('');
            }else{
                if(E.target.type!='notSet'&&E.target.name)C.target=E.target.name;else D.push('target');
                D.push('_cke_pa_onclick','onclick');
            }
            if(E.adv){
                var X=function(ah,ai){
                    var aj=E.adv[ah];
                    if(aj)C[ai]=aj;else D.push(ai);
                };

                if(this._.selectedElement)X('advId','id');
                X('advLangDir','dir');
                X('advAccessKey','accessKey');
                X('advName','name');
                X('advLangCode','lang');
                X('advTabIndex','tabindex');
                X('advTitle','title');
                X('advContentType','type');
                X('advCSSClasses','class');
                X('advCharset','charset');
                X('advStyles','style');
            }
            if(!this._.selectedElement){
                var Y=G.getSelection(),Z=Y.getRanges();
                if(Z.length==1&&Z[0].collapsed){
                    var aa=new CKEDITOR.dom.text(C._cke_saved_href,G.document);
                    Z[0].insertNode(aa);
                    Z[0].selectNodeContents(aa);
                    Y.selectRanges(Z);
                }
                var ab=new CKEDITOR.style({
                    element:'a',
                    attributes:C
                });
                ab.type=CKEDITOR.STYLE_INLINE;
                ab.apply(G.document);
                if(E.adv&&E.adv.advId){
                    var ac=this.getParentEditor().document.$.getElementsByTagName('a');
                    for(W=0;W<ac.length;W++){
                        if(ac[W].href==C.href){
                            ac[W].id=E.adv.advId;
                            break;
                        }
                    }
                }
            }else{
                var ad=this._.selectedElement,ae=ad.getAttribute('_cke_saved_href'),af=ad.getHtml();
                if(CKEDITOR.env.ie&&C.name!=ad.getAttribute('name')){
                    var ag=new CKEDITOR.dom.element('<a name="'+CKEDITOR.tools.htmlEncode(C.name)+'">',G.document);
                    Y=G.getSelection();
                    ad.moveChildren(ag);
                    ad.copyAttributes(ag,{
                        name:1
                    });
                    ag.replace(ad);
                    ad=ag;
                    Y.selectElement(ad);
                }
                ad.setAttributes(C);
                ad.removeAttributes(D);
                if(ae==af)ad.setHtml(C._cke_saved_href);
                if(ad.getAttribute('name'))ad.addClass('cke_anchor');else ad.removeClass('cke_anchor');
                if(this.fakeObj)G.createFakeElement(ad,'cke_anchor','anchor').replace(this.fakeObj);
                delete this._.selectedElement;
            }
        },
        onLoad:function(){
            if(!a.config.linkShowAdvancedTab)this.hidePage('advanced');
            if(!a.config.linkShowTargetTab)this.hidePage('target');
        },
        onFocus:function(){
            var C=this.getContentElement('info','linkType'),D;
            if(C&&C.getValue()=='url'){
                D=this.getContentElement('info','url');
                D.select();
            }
        }
    };

});
