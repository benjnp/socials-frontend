export const userQuery = (userId) => {
    const query = `*[_type == "user" && _id == '${userId}']`
    return query
}

export const searchQuery = (searchTerm) => {
    const query = `*[_type == "pin" && title match '${searchTerm}*' || category match '${searchTerm}*' || about match '${searchTerm}*']{
        image {
            asset -> {
                url
            }
        },
        _id,
        destination,
        postedBy -> {
            _id,
            userName,
            image
        },
        like[] {
            _key,
            likedBy -> {
                _id,
                userName,
                image
            },
        },
    }`

    return query
}

export const feedQuery = `*[_type == 'pin'] | order(_createAt desc) {
    image {
        asset -> {
            url
        }
    },
    _id,
    destination,
    category -> {
        name
    },
    postedBy -> {
        _id,
        userName,
        image
    },
    like[] {
        _key,
        likedBy -> {
            _id,
            userName,
            image
        },
    },
}`

export const categoryQuery = `*[_type == 'category'] | order(_createAt desc) {
    name,
    image {
        asset -> {
            url
        }
    },
    _id,
}`

export const pinDetailQuery = (pinId) => {
    const query = `*[_type == "pin" && _id == '${pinId}']{
      image{
        asset->{
          url
        }
      },
      _id,
      title, 
      about,
      category -> {
        name
      },
      destination,
      postedBy->{
        _id,
        userName,
        image
      },
     like[]{
        postedBy->{
          _id,
          userName,
          image
        },
      },
      comments[]{
        comment,
        _key,
        postedBy->{
          _id,
          userName,
          image
        },
      }
    }`;
    return query;
  };
  
  export const pinDetailMorePinQuery = (pin) => {
    const query = `*[_type == "pin" && category->name == '${pin.category.name}' && _id != '${pin._id}' ]{
      image{
        asset->{
          url
        }
      },
      _id,
      destination,
      postedBy->{
        _id,
        userName,
        image
      }
    }`;
    return query;
  };

  export const userCreatedPinsQuery = (userId) => {
    const query = `*[ _type == 'pin' && userId == '${userId}'] | order(_createdAt desc){
      image{
        asset->{
          url
        }
      },
      _id,
      destination,
      postedBy->{
        _id,
        userName,
        image
      },
      like[]{
        postedBy->{
          _id,
          userName,
          image
        },
      },
    }`;
    return query;
  };
  
  export const userSavedPinsQuery = (userId) => {
    const query = `*[_type == 'pin' && '${userId}' in save[].userId ] | order(_createdAt desc) {
      image{
        asset->{
          url
        }
      },
      _id,
      destination,
      postedBy->{
        _id,
        userName,
        image
      },
      like[]{
        postedBy->{
          _id,
          userName,
          image
        },
      },
    }`;
    return query;
  };