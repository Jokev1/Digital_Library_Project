import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className='flex justify-start items-start flex-col'>
        <h1 className='text-9xl font-semibold font-serif'> Digital</h1>
        <h1 className='mb-14 text-9xl font-semibold font-serif text-gray-700'> Library</h1>
        <Link to={'/Library'} className='text-white'><button className='rounded-full px-20 hover:border-indigo-500'> Click Here to Start Browsing </button></Link>
    </div>
  )
}

export default Home