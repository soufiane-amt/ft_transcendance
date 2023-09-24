


export default async function handle (req, res)
{
    if (req.method === 'PUT')
    {
        try {
            await fetch("http://localhost:3000/messages/markAsRead", 
            {
                method : "PUT", 
                headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ channelId }),
                })
        }
        catch (error)
        {
            console.log (error)
        }
    }
    else 
    {
        req.status (405)
    }
}