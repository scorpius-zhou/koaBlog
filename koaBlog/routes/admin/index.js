var router = require('koa-router')();

var DB = require('../../model/db.js');

router.get('/', async (ctx)=>{
    await ctx.render('admin/index');
});

router.get('/changeStatus', async (ctx)=>{
    // console.log(ctx.query);

    let collection = ctx.query.collectionName;
    let attr = ctx.query.attr;
    let id = ctx.query.id;

    let findResult = await DB.find(collection, {'_id': DB.getObjectId(id)});

    if( findResult.length > 0 ) {
        if( findResult[0][attr] == '1' ) {
            var json = {
                [attr]: '0'
            }
        } else {
            var json = {
                [attr]: '1'
            }
        }

        let updateResult = await DB.update(collection, {'_id': DB.getObjectId(id)}, json );

        if(updateResult){
            ctx.body={"message":'更新成功',"success":true};
        }else{
            ctx.body={"message":"更新失败","success":false}
        }
    } else {
        ctx.body={"message":'更新失败,参数错误',"success":false};
    }  
});

router.get('/remove', async (ctx) => {
    try {

        var collection = ctx.query.collection;
        var id = ctx.query.id;
    
        DB.remove( collection, { '_id':DB.getObjectId(id) });

        ctx.redirect(ctx.state.G.prevPage);
    }catch(err){
        ctx.redirect(ctx.state.G.prevPage);
    }
});
module.exports = router.routes();