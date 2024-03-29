import React, { useState, useEffect, } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { RiHomeFill } from 'react-icons/ri'
import { IoIosArrowForward } from 'react-icons/io'
import { categoryQuery } from '../utils/data'
import { client } from '../client'

import logo from '../assets/socials_black.png'

const isNotActiveStyle = "flex items-center px-5 text-gray-500 gap-3 hover:text-black transition-all duration-200 ease-in-out capitalize"
const isActiveStyle = "flex items-center px-5 font-extrabold border-r-2 border-black gap-3 transition-all duration-200 ease-in-out capitalize"
const categories = [
    { name: 'Animals'},
    { name: 'Wallpapers'},
    { name: 'Photography'},
    { name: 'Gaming'},
    { name: 'Coding'},
    { name: 'Other'},
]

const Sidebar = ({ user, closeToggle }) => {

    const [ categories, setCategories ] = useState(null)

    useEffect(() => {
        client.fetch(categoryQuery).then((data) => {
            setCategories(data)
        })}, [])
    
  const handleCloseSidebar = () => {
    if(closeToggle)
        closeToggle(false)
  }

  return (
    <div className="flex flex-col justify-between bg-white h-full overflow-y-scroll min-w-210 hide-scrollbar">
        <div className="flex flex-col">
            <Link to="/" className="flex px-5 gap-2 my-6 pt-1 w-190 items-center" onClick={handleCloseSidebar}>
                <img src={logo} alt="logo" className="w-full" />
            </Link>
            <div className="flex flex-col gap-5">
                <NavLink
                    to="/"
                    className={({ isActive }) => isActive ? isActiveStyle : isNotActiveStyle}
                    onClick={handleCloseSidebar}
                >
                    <RiHomeFill />
                    Home
                </NavLink>
                <h3 className="mt-2 px-5 text-base 2xl:text-xl">Discover Categories</h3>
                {categories?.map((category) => (
                    <NavLink 
                        to={`/category/${category.name}`}
                        className={({ isActive }) => isActive ? isActiveStyle : isNotActiveStyle}
                        onClick={handleCloseSidebar}
                        key={category.name}
                    >
                        <img src={category.image.asset.url} alt="category" className="w-8 h-8 rounded-full shadow-sm" />
                        {category.name}
                    </NavLink>
                ))}
            </div>
        </div>
        {user && (
            <Link
                to={`user-profile/${user._id}`}
                className="flex my-5 mb-3 gap-2 items-center p-2 bg-white rounded-lg shadow-lg mx-3"
                onClick={handleCloseSidebar}
            >
                <img src={user.image} className="w-10 h-10 rounded-full" alt="user-profile"/>
                <p>{user.userName}</p>
            </Link>
        )}
    </div>
  )
}

export default Sidebar