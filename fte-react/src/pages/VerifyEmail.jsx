// src/pages/VerifyEmail.js
import React, { useEffect, useState } from "react";

import api from "@/api/axios";

export default function VerifyEmail() {
    const [status, setStatus] = useState("verifying");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const id = params.get("id");

        if (!token || !id) {
            setStatus("invalid");
            return;
        }

        api.get(`/auth/verify-email?token=${token}&id=${id}`)
            .then(() => {
                setStatus("success");
                setTimeout(() => {
                    window.location.href = "/login";
                }, 3000);
            })
            .catch(() => {
                setStatus("failed");
            });
    }, []);

    if (status === "verifying") return <div>Verifying, please wait...</div>;
    if (status === "success")
        return <div>Verification successful! You will be redirected to the login page...</div>;
    if (status === "failed")
        return (
            <div>
                Verification failed or the link has expired, please reapply for the verification
                letter.{" "}
            </div>
        );
    if (status === "invalid") return <div>The verification link is invalid. </div>;
}
