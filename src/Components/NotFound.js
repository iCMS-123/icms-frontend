import React from 'react'
import useDocumentTitle from '../Hooks/useDocumentTitle'

const NotFound = () => {
    useDocumentTitle('404-Page Not Found')
  return (
    <div>Page Not Found</div>
  )
}

export default NotFound