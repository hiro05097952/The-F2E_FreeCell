let cache = document.querySelectorAll('.top ul.cacheZone'),
    random = document.querySelectorAll('.randomZone ul'),
    done = document.querySelectorAll('.doneZone ul'),
    vueData = app.$data;
    reset = document.querySelector('.return');

// 下面隨機牌區
for(let i = 0 ; i<random.length; i++){
    new Sortable(random[i],{
        group:{
            name:'cards',
            put: true,
        },
        sort: false,
        draggable: '.randomZone ul li:last-child',
        // multiDrag: true,
        // selectedClass: 'seleted',
        animation: 200,
        onMove: function(e){
            console.log('this is onmove');
            return check(e);
        },
    })
}

// 左上角只能放一張
for(let i = 0 ; i<cache.length; i++){
    new Sortable(cache[i],{
        group:{
            name:'cards',
            put: function(e){
                return e.el.children.length < 1 ? true : false
            }
        },
        sort: false,
        onMove: function(e){
            return check(e);
        }
    })
}

// 右上角
for(let i = 0; i<done.length; i++){
    new Sortable(done[i],{
        group:{
            name:'cards',
            pull: false,
        },
        sort:false,
        onAdd: function(e){
            // 計分方式 =>
            // 3分鐘(180秒)以內: 10 + 數字 x ( (540-秒數) / 180 ) , 
            // 5分鐘(300秒)以內: 10 + 數字 x ( (780-秒數) / 300 ) ,
            // 10分鐘以內: 10 + 數字 x ( (900-秒數) / 600)
            // 10分鐘以上: 10
            if(vueData.time <= 180){
                vueData.score += 10 + Math.round((e.to.children.length-1) * (540-vueData.time)/180)
            }else if(vueData.time <= 300){
                vueData.score += 10 + Math.round((e.to.children.length-1) * (780-vueData.time)/300)
            }else if(vueData.time <= 600){
                vueData.score += 10 + Math.round((e.to.children.length-1) * (900-vueData.time)/600)
            }else{
                vueData.score += 10
            }
            // 完成進度
            if(e.to.children.length-1 === 13){
                vueData.completeStatus += 13
                if(vueData.completeStatus === 52){                    
                    vueData.option.open = true
                    vueData.option.menu = 'congratulation'
                }
            }
        },
    })
}

function check(e){
    if(e.to.className === 'cacheZone'){
        return 1
    }else if(e.to.className === 'shuffle'){
        // 牌位空了放任何牌都可以
        if(e.to.children.length === 0){
            return 1
        }
        // 洗牌區接龍，確認拖的數字顏色及放的區域，符合條件(小於最後一張數字，不同花色(紅, 黑) ) 及回傳 1 => 放置最後一張
        let dragColor = e.dragged.className.indexOf('diamond') !== -1 || e.dragged.className.indexOf('heart') !== -1 ? 'red' : 'black'
        let dragNum = Number(e.dragged.attributes[0].value)

        let dropColor = e.to.lastChild.className.indexOf('diamond') !== -1 || e.to.lastChild.className.indexOf('heart') !== -1 ? 'red' : 'black'
        let dropNum = Number(e.to.lastChild.attributes[0].value)
        if(dragColor === dropColor || dragNum+1 !== dropNum){
            return false
        }else{
            return 1
        }
    }else if(e.to.className.indexOf('done') !== -1){                                
        let dragColor = String([...e.dragged.classList].slice(1,2)  )              
        let dragNum = Number(e.dragged.attributes[0].value)

        let dropColor = String([...e.to.classList].slice(0,1))                
        let dropNum = Number(e.to.lastChild.attributes[0].value)
        
        if(dragColor !== dropColor || dragNum !== dropNum+1){
            return false
        }else{
            return 1
        }
    }
}
