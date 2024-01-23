import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { MdDownloadForOffline } from 'react-icons/md'
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs'
import { AiTwotoneDelete } from 'react-icons/ai'
import { client, urlFor } from '../client'
import { fetchUser } from '../utils/fetchUser'

const Pin = ({ pin: { postedBy, image, _id, destination, like } }) => {

  const [postHovered, setPostHovered] = useState(false)  
  const [alreadyLiked, setAlreadyLiked] = useState(false)
  const navigate = useNavigate()
  const user = fetchUser()
  
  const likePin = (id) => {

    if(Object.keys(user).length !== 0){
        if(!alreadyLiked) {
            client.patch(id).setIfMissing({ like: [] })
            .insert('after', 'like[-1]', [{
                _key: uuidv4(),
                userId: user?.sub,
                likedBy: {
                    _type: 'postedBy',
                    _ref: user.sub
                }
            }])
            .commit()
            .then(() => {
                window.location.reload();
            })
        } 
    }
    
  }

  useEffect(() => {
    let isLiked
    if(user) {
        isLiked = !!(like?.filter((item) => item.likedBy?._id === user?.sub))?.length
        setAlreadyLiked(isLiked)
    }
  }, [])

  const deletePin = (id) => {   
    client.delete(id).then(() => {
        window.location.reload();
    })
    
  }

  return (
    <div className="m-2">
        <div
            onMouseEnter={() => setPostHovered(true)}
            onMouseLeave={() => setPostHovered(false)}
            onClick={() => navigate(`/pin-detail/${_id}`)}
            className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
        >
            <img src={urlFor(image).width(250).url()} alt="user-post" className="rounded-lg w-full"/>
            {postHovered && (
                <div className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50" style={{height: '100%'}}>
                    {user && <p>Hi</p>}
                    {/* <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                            <a 
                                href={`${image?.asset?.url}?dl=`}
                                download
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white w-8 h-8 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                            >
                                <MdDownloadForOffline size={25}/>
                            </a>
                        </div>
                        {alreadyLiked ? (
                            <button type="button" className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none" 
                            onClick={(e) => e.stopPropagation()}>
                                { like?.length } Liked
                            </button>
                        ) : (
                            <button 
                                type="button" 
                                className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none" 
                                onClick={(e) => {
                                    e.stopPropagation()
                                    likePin(_id)
                                }}
                            >
                                Like
                            </button>
                        )}
                    </div> */}
                    <div className="flex justify-between items-center gap-2 w-full">
                        {destination && (
                            <a
                                href={destination}
                                target="_blank"
                                rel="noreferrer"
                                className="bg-white flex items-center gap-2 text-black py-1 px-2 rounded-full opacity-70 hover:opacity-100 hover:shadow-md"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <BsFillArrowUpRightCircleFill />
                                <span className="text-xs">{destination?.slice(8,22)}</span>
                                
                            </a>
                        )}
                        {postedBy?._id === user?.sub && (
                            <button 
                                type="button" 
                                onClick={(e) => {
                                    e.stopPropagation()
                                    deletePin(_id)
                                }}
                                className="bg-white p-2 opacity-70 hover:opacity-100 font-bold text-dark text-base rounded-3xl hover:shadow-md outline-none" 
                            >
                                <AiTwotoneDelete />
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
        <Link to={`user-profile/${postedBy?._id}`} className="flex gap-2 mt-2 items-center">
            <img src={postedBy?.image} alt="user-profile" 
                className="w-8 h-8 rounded-full object-cover"
            />
            <p className="font-base capitalize">{postedBy?.userName}</p>
        </Link>
    </div>
  )
}

export default Pin