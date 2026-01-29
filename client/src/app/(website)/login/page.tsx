"use client";

import { Login } from "@/component/Login/login";
import { useState } from "react";

export default function LoginPage() {

    const [open, setOpen] = useState(true);
    return (
        <Login open={open} setOpen={setOpen} />
    );
}
