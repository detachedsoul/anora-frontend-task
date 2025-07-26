/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DetailedHTMLProps, forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import { FieldError, Merge, FieldErrorsImpl } from "react-hook-form";

interface IFormInput
	extends DetailedHTMLProps<
		InputHTMLAttributes<HTMLInputElement>,
		HTMLInputElement
	> {
	type: string;
	required?: boolean;
	error?: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
	className?: string;
	placeholder?: string;
	onChange: React.ChangeEventHandler<HTMLInputElement>;
}

const FormInput = forwardRef<HTMLInputElement, IFormInput>(
	(
		{ error = "", className, placeholder, onChange: change, ...props },
		ref,
	) => {
		return (
			<div className="relative grid gap-2 w-full">
                <input
                    ref={ref}
                    className={cn("input", className, {
                        "border-brand-red": error,
                    })}
                    id={props?.id ?? props?.name}
                    placeholder={placeholder}
                    {...props}
                    type="text"
                    onChange={(e) => {
                        change(e);
                    }}
                />

				{error && (
					<p className="text-brand-red text-sm">{error as string}</p>
				)}
			</div>
		);
	},
);

FormInput.displayName = "FormInput";

export default FormInput;
