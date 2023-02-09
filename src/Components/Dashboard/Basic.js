import React from 'react'
import useDocumentTitle from "../../Hooks/useDocumentTitle";

export const Basic = () => {
  useDocumentTitle("Dashboard");
  return (
    <div>Dashboard Home</div>
  )
}
