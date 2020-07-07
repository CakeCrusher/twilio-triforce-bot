const response = (body, data, twiml) => {
    const message = twiml.message()
    const id = body.From
    const userInput = body.Body

    if(!data[id]){
        data[id] = {
            location: {
                x: 0,
                y: 0
            },
            moved: false,
            won: false
        }
    }

    if(!data[id].moved) {
        message.body('You are blind and need to locate your triforce. You know your triforce is two steps away from you. You may step in one of four directions: N, E, S, W. You may reset your location at any time by typing: R')
        data[id].moved = true
    } else {
        switch (userInput) {
            case 'N':
                data[id].location.y = Number(data[id].location.y) + 1
                break
            case 'S':
                data[id].location.y = Number(data[id].location.y) - 1
                break
            case 'E':
                data[id].location.x = Number(data[id].location.x) + 1
                break
            case 'W':
                data[id].location.x = Number(data[id].location.x) - 1
                break
            case 'R':
                data[id].location = {x: 0, y: 0}
                break
            default:
                console.log(`did not understand user input: ${userInput}`)
        }
        if (data[id].location.y === 1 && data[id].location.x === 1 && !data[id].won) {
            message.media('https://media.giphy.com/media/YWUpVw86AtIbe/giphy.gif')
            message.body('You have found your triforce! (game session has ended)')
            data[id].won = true
            console.log(id + " WON!!!")
            return data
        } else if (userInput === 'R') {
            message.body('Location reset')
        } else {
            message.body(`You stepped ${userInput}`)
        }
    }

    if(data[id].won) {
        return 'won'
    }

    return data
}

module.exports = {response}