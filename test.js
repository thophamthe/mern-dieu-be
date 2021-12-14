const modeluser= require("./model/user")


const test=()=>{
    modeluser.updateMany ({},
        {
        set: {refreshToken:null}
        },
        { upsert: false, multi:true }
    
    )
}
test()