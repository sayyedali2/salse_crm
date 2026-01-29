"use client"

import Register from "@/component/registry/registryDialog"
import { useState } from "react"


export default function RegisterPage() {
    const [open,setOpen] = useState(true)
    return <Register open={open} setOpen={setOpen} />
}