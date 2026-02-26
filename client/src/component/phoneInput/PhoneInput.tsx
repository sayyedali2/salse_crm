"use client";

import { useState, useEffect } from "react";
import {
    TextField,
    MenuItem,
    Select,
    InputAdornment,
    FormControl,
} from "@mui/material";

const COUNTRY_CODES = [
    { code: "+91", country: "IN", flag: "🇮🇳", label: "India" },
    { code: "+1", country: "US", flag: "🇺🇸", label: "United States" },
    { code: "+44", country: "GB", flag: "🇬🇧", label: "United Kingdom" },
    { code: "+971", country: "AE", flag: "🇦🇪", label: "UAE" },
    { code: "+966", country: "SA", flag: "🇸🇦", label: "Saudi Arabia" },
    { code: "+61", country: "AU", flag: "🇦🇺", label: "Australia" },
    { code: "+49", country: "DE", flag: "🇩🇪", label: "Germany" },
    { code: "+33", country: "FR", flag: "🇫🇷", label: "France" },
    { code: "+81", country: "JP", flag: "🇯🇵", label: "Japan" },
    { code: "+86", country: "CN", flag: "🇨🇳", label: "China" },
    { code: "+82", country: "KR", flag: "🇰🇷", label: "South Korea" },
    { code: "+65", country: "SG", flag: "🇸🇬", label: "Singapore" },
    { code: "+60", country: "MY", flag: "🇲🇾", label: "Malaysia" },
    { code: "+880", country: "BD", flag: "🇧🇩", label: "Bangladesh" },
    { code: "+92", country: "PK", flag: "🇵🇰", label: "Pakistan" },
    { code: "+977", country: "NP", flag: "🇳🇵", label: "Nepal" },
    { code: "+94", country: "LK", flag: "🇱🇰", label: "Sri Lanka" },
    { code: "+55", country: "BR", flag: "🇧🇷", label: "Brazil" },
    { code: "+52", country: "MX", flag: "🇲🇽", label: "Mexico" },
    { code: "+27", country: "ZA", flag: "🇿🇦", label: "South Africa" },
    { code: "+234", country: "NG", flag: "🇳🇬", label: "Nigeria" },
    { code: "+254", country: "KE", flag: "🇰🇪", label: "Kenya" },
    { code: "+20", country: "EG", flag: "🇪🇬", label: "Egypt" },
    { code: "+39", country: "IT", flag: "🇮🇹", label: "Italy" },
    { code: "+34", country: "ES", flag: "🇪🇸", label: "Spain" },
    { code: "+31", country: "NL", flag: "🇳🇱", label: "Netherlands" },
    { code: "+46", country: "SE", flag: "🇸🇪", label: "Sweden" },
    { code: "+7", country: "RU", flag: "🇷🇺", label: "Russia" },
    { code: "+90", country: "TR", flag: "🇹🇷", label: "Turkey" },
    { code: "+62", country: "ID", flag: "🇮🇩", label: "Indonesia" },
    { code: "+66", country: "TH", flag: "🇹🇭", label: "Thailand" },
    { code: "+63", country: "PH", flag: "🇵🇭", label: "Philippines" },
    { code: "+84", country: "VN", flag: "🇻🇳", label: "Vietnam" },
    { code: "+48", country: "PL", flag: "🇵🇱", label: "Poland" },
    { code: "+41", country: "CH", flag: "🇨🇭", label: "Switzerland" },
];

/**
 * Extracts the country code and local number from a full phone string.
 * Tries to match the longest country code first.
 */
function parsePhone(fullPhone: string): {
    countryCode: string;
    localNumber: string;
} {
    if (!fullPhone) return { countryCode: "+91", localNumber: "" };

    // Sort codes by length descending so we match longest first (e.g. +971 before +97 before +9)
    const sortedCodes = [...COUNTRY_CODES].sort(
        (a, b) => b.code.length - a.code.length
    );
    for (const c of sortedCodes) {
        if (fullPhone.startsWith(c.code)) {
            return { countryCode: c.code, localNumber: fullPhone.slice(c.code.length) };
        }
    }
    return { countryCode: "+91", localNumber: fullPhone };
}

interface PhoneInputProps {
    /** The full phone value including country code, e.g. "+919876543210" */
    value?: string;
    /** Called with the full phone string (countryCode + local number) */
    onChange?: (fullPhone: string) => void;
    /** Error state */
    error?: boolean;
    /** Helper text for the field */
    helperText?: string;
    /** Label for the text field */
    label?: string;
    /** MUI TextField variant */
    variant?: "outlined" | "standard" | "filled";
    /** MUI TextField size */
    size?: "small" | "medium";
    /** Full width toggle */
    fullWidth?: boolean;
    /** Additional sx props for the TextField */
    sx?: object;
}

/**
 * Reusable phone input with country code dropdown.
 * Accepts a full phone string (e.g. "+919876543210") and returns the same on change.
 * Works with both react-hook-form register (via value/onChange) and Controller.
 */
export default function PhoneInput({
    value = "",
    onChange,
    error,
    helperText,
    label = "Phone",
    variant = "outlined",
    size = "medium",
    fullWidth = true,
    sx,
}: PhoneInputProps) {
    const { countryCode: initialCC, localNumber: initialLocal } = parsePhone(value);
    const [countryCode, setCountryCode] = useState(initialCC);
    const [localNumber, setLocalNumber] = useState(initialLocal);

    // Sync when external value changes (e.g. form reset or default values)
    useEffect(() => {
        const { countryCode: cc, localNumber: ln } = parsePhone(value);
        setCountryCode(cc);
        setLocalNumber(ln);
    }, [value]);

    const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newLocal = e.target.value;
        setLocalNumber(newLocal);
        onChange?.(newLocal ? `${countryCode}${newLocal}` : "");
    };

    const handleCountryChange = (newCode: string) => {
        setCountryCode(newCode);
        onChange?.(localNumber ? `${newCode}${localNumber}` : "");
    };

    return (
        <TextField
            fullWidth={fullWidth}
            label={label}
            placeholder="9876543210"
            value={localNumber}
            onChange={handleLocalChange}
            error={error}
            helperText={helperText}
            variant={variant}
            size={size}
            sx={sx}
            slotProps={{
                input: {
                    startAdornment: (
                        <InputAdornment position="start" sx={{ mr: 0 }}>
                            <FormControl size="small" variant="standard">
                                <Select
                                    value={countryCode}
                                    onChange={(e) => handleCountryChange(e.target.value)}
                                    disableUnderline
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                maxHeight: 300,
                                                minWidth: 260,
                                            },
                                        },
                                    }}
                                    sx={{
                                        fontSize: "0.875rem",
                                        fontWeight: 500,
                                        "& .MuiSelect-select": {
                                            py: 0,
                                            pr: "20px !important",
                                            pl: 0,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 0.5,
                                        },
                                    }}
                                    renderValue={(v) => {
                                        const c = COUNTRY_CODES.find((cc) => cc.code === v);
                                        return c ? `${c.flag} ${c.code}` : v;
                                    }}
                                >
                                    {COUNTRY_CODES.map((c) => (
                                        <MenuItem
                                            key={c.country}
                                            value={c.code}
                                            sx={{
                                                display: "flex",
                                                gap: 1.5,
                                                fontSize: "0.875rem",
                                            }}
                                        >
                                            <span>{c.flag}</span>
                                            <span style={{ minWidth: 45 }}>{c.code}</span>
                                            <span style={{ color: "#888" }}>{c.label}</span>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </InputAdornment>
                    ),
                },
            }}
        />
    );
}

export { COUNTRY_CODES, parsePhone };
