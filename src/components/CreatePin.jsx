import React, { useState, useEffect } from 'react'
import { AiOutlineCloudUpload } from 'react-icons/ai' 
import { MdDelete } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { client } from '../client'
import Spinner from './Spinner'
import { categoryQuery } from '../utils/data'

const CreatePin = ({user}) => {

  const [ categories, setCategories ] = useState(null)
  const [ title, setTitle ] = useState('')
  const [ about, setAbout ] = useState('')
  const [ destination, setDestination ] = useState('')
  const [ isAllFilled, setIsAllFilled ]  = useState(false)
  const [ category, setCategory ] = useState('')
  const [ creatingPin, setCreatingPin ] = useState(false)
  const [ imageAsset, setImageAsset ] = useState(null)
  const [ wrongImagetype, setWrongImagetype ] = useState(false)
  const [ imageUploadMessage, setImageUploadMessage] = useState("Click to upload")

  const navigate = useNavigate()

  useEffect(() => {
    client.fetch(categoryQuery).then((data) => {
      setCategories(data)
      console.log(data)
  })}, [])

  const uploadImage = (e) => {
    const { type, name } = e.target.files[0]

    if (type === 'image/png' || type === 'image/svg' || type === 'image/jpeg' || type === 'image/gif' || type === 'image/tiff') {
      setWrongImagetype(false)
      setCreatingPin(true)
      setImageUploadMessage("Uploading...")
      client.assets.upload('image', e.target.files[0], {contentType: type, filename: name})
      .then((doc) => {
        setImageAsset(doc)
        setCreatingPin(false)
        setImageUploadMessage("Click to upload")
      })
      .catch((err) => {
        console.log("Image upload error")
        setCreatingPin(false)
        setImageUploadMessage("Click to upload")
      })
    }
    else  
      setWrongImagetype(true)
  }

  const savePin = () => {
    if(title && about && category && destination && imageAsset?._id) {
      const doc = {
        _type: 'pin',
        title, about, destination, 
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset?._id
          }
        },
        userId: user._id,
        postedBy: {
          _type: 'postedBy',
          _ref: user._id
        },
        category: {
          _type: 'category',
          _ref: category
        }
      }
      client.create(doc).then(() => {
        navigate("/")
      })
    }
    else {
      setIsAllFilled(true)
      setTimeout(() => setIsAllFilled(false), 2000)
    }
  }
  
  return (
    <div className="flex flex-col justify-center items-center mt-5 lg:h-4/5">
      {isAllFilled && (
        <p className="text-red-500 mb-5 text-xl transition-all duration-150 ease-in">Please fill in all the fields.</p>
      )}
      <div className="flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full">
        <div className="bg-secondaryColor p-3 flex flex-0.7 w-full">
          <div className="flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420">
            {creatingPin && <Spinner />}
            {wrongImagetype && <p>Wrong image type</p>}
            {!imageAsset ? (
              <label>
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="flex flex-col justify-center items-center">
                    <p className="font-bold text-2xl">
                      <AiOutlineCloudUpload />
                    </p>
                    <p className="text-lg">{imageUploadMessage}</p>
                  </div>
                  <p className="mt-32 text-gray-400">
                    Use high quality JPG, PNG, GIF, SVG less than 20MB
                  </p>
                </div>
                <input 
                  type="file"
                  name="upload-image"
                  onChange={uploadImage}
                  className="w-0 h-0"
                >
                </input>
              </label>  
            ) : (
              <div className="relative h-full">
                <img src={imageAsset?.url} alt="uploaded-image" className="h-full w-full"/>
                <button
                  type="button"
                  className="absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shado-md transition-all duration-500 ease-in-out"
                  onClick={() => setImageAsset(null)}                  
                >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full">
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add your title"
            className="outline-none text-xl sm:text-2xl font-bold border-b-2 border-gray-200 p-2"
          />
          {/* { user && (
            <div className="flex gap-2 my-2 items-center bg-white rounded-lg">              
              <img 
                src={user.image}
                className="w-10 h-10 rounded-full"
                alt="user-profile" />
              <p className="font-bold">{user.userName}</p>
            </div>
          )} */}
          <input 
            type="text" 
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Put a description"
            className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
          />
          {/* <label for="currency" class="sr-only">Currency</label> */}
          <input 
            type="text" 
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Set the destination URL"
            className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
          />
      
          <select 
            id="categories" 
            name="category" 
            className="outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer bg-white"
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="other" className="bg-white">Select Category</option>
            {categories && (
              categories?.map((category) => 
                <option 
                  className="text-base border-0 outline-none capitalize bg-white text-black"
                  value={category._id}
                  key={category._id}
                >
                  {category.name}
                </option>
              )
            )}
          </select>
          <div className="flex-justify-end items-end mt-5">
            <button
              type="button"
              onClick={savePin}
              className="bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none"
            >
              Save Pin
            </button>
          </div>
          
          
        </div>
      </div>
    </div>
  )
}

export default CreatePin