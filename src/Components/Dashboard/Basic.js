import React from 'react'
import useDocumentTitle from "../../Hooks/useDocumentTitle";

export const Basic = () => {
  useDocumentTitle("Dashboard");
  return (
    <div>
    
    <p className="h1">Welcome to Dashboard !</p>
    
    </div>
  )
}
