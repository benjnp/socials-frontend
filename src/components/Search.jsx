import React, { useState, useEffect } from 'react'
import MasonryLayout from './MasonryLayout'
import { client } from '../client'
import { feedQuery, searchQuery } from '../utils/data'
import Spinner from './Spinner'

const Search = ({searchTerm}) => {
  const [pins, setPins] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const query = searchQuery(searchTerm)
    client.fetch(query).then((data) => {
      setPins(data)
      setLoading(false)
    })
  }, [searchTerm])

  return (
    <div>
      {loading && <Spinner message="Searching for pins..."/>}
      <MasonryLayout pins={pins} />
    </div>
  )
}

export default Search