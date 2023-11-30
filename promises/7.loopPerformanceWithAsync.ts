/*
  assume we have to fetch user info for multiple ids thorugh an api , with a for loop and using async await (in method getAllUsers) this method has no problem it will work as expected but 
  next iteration of your loop will begin once a single user information as been collected. So, based on this method, this function will take n seconds to execute based on number of Ids,
  you will get synchronous output

  getAllUserImproved method adheres to the true asynchronous approach as it returns promise object , which will eventually be executed
  So, rather than running it sequentially, it will return random invocations where each is independent and execute at its own pace with no relevant order.
*/

function fetchUserInfo(userId: number):Promise<Record<string, any>>{
    return new Promise(resolve=> {
        setTimeout(()=>{
            resolve({
                id: userId,
                mail: `user${userId}@gmail.com`,
                name: `user${userId}`
            })
        }, 1000)
    })
}

export async function getAllUsers(userIds:number[] =[1,2,3,4,5,6,7,8,9,10]) {
    const users:Record<string, any>[] = []
    for (let index = 0; index < userIds.length; index++) {
        const userData = await fetchUserInfo(userIds[index])
        console.log(userData);
        
        users.push(userData)     
    }
    console.log(users)
}
// the above code will wait for each fetchUserInfo inside the for loop thus it is very inefficient , lets improve this

export async function getAllUserImproved(userIds:number[] =[1,2,3,4,5,6,7,8,9,10]) {
    const promises = userIds.map(async (id) => {        
        return fetchUserInfo(id)
    })

    const data = await Promise.all(promises)

    console.log(data);
    
}

getAllUserImproved()
