"use client";

import { cn } from "@/utils/cn";
import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	isSubmitting?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			isSubmitting,
			children,
			disabled,
			className,
			type = "button",
			...props
		},
		ref,
	) => {
		return (
			<button
				ref={ref}
				type={type}
				className={cn(
					"btn flex items-center justify-center gap-3 text-center",
					{
						"cursor-not-allowed hover:outline-none": disabled || isSubmitting,
						"bg-brand-red/50": disabled,
					},
					className,
				)}
				disabled={disabled || isSubmitting}
				{...props}
			>
				{isSubmitting && (
					<svg
						className="animate-spin size-5 inline"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle
							className="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							strokeWidth="4"
						></circle>
						<path
							className="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
				)}

				{children}
			</button>
		);
	},
);

Button.displayName = "Custom Button";

export default Button;
