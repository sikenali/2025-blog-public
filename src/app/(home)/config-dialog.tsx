'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import { DialogModal } from '@/components/dialog-modal'
import { useAuthStore } from '@/hooks/use-auth'
import { useConfigStore } from './stores/config-store'
import { pushSiteContent } from './services/push-site-content'
import type { SiteContent } from './stores/config-store'
import { hashFileSHA256 } from '@/lib/file-utils'

export type FileItem = { type: 'file'; file: File; previewUrl: string; hash?: string } | { type: 'url'; url: string }

interface ConfigDialogProps {
	open: boolean
	onClose: () => void
}

export default function ConfigDialog({ open, onClose }: ConfigDialogProps) {
	const { isAuth, setPrivateKey } = useAuthStore()
	const { siteContent, setSiteContent, regenerateBubbles } = useConfigStore()
	const [formData, setFormData] = useState<SiteContent>(siteContent)
	const [originalData, setOriginalData] = useState<SiteContent>(siteContent)
	const [isSaving, setIsSaving] = useState(false)
	const keyInputRef = useRef<HTMLInputElement>(null)
	const [faviconItem, setFaviconItem] = useState<FileItem | null>(null)
	const [avatarItem, setAvatarItem] = useState<FileItem | null>(null)
	const faviconInputRef = useRef<HTMLInputElement>(null)
	const avatarInputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		if (open) {
			const current = { ...siteContent }
			setFormData(current)
			setOriginalData(current)
			setFaviconItem(null)
			setAvatarItem(null)
		}
	}, [open, siteContent])

	useEffect(() => {
		return () => {
			// Clean up preview URLs on unmount
			if (faviconItem?.type === 'file') {
				URL.revokeObjectURL(faviconItem.previewUrl)
			}
			if (avatarItem?.type === 'file') {
				URL.revokeObjectURL(avatarItem.previewUrl)
			}
		}
	}, [faviconItem, avatarItem])

	const handleChoosePrivateKey = async (file: File) => {
		try {
			const text = await file.text()
			setPrivateKey(text)
			await handleSave()
		} catch (error) {
			console.error('Failed to read private key:', error)
			toast.error('Failed to read the key file')
		}
	}

	const handleSaveClick = () => {
		if (!isAuth) {
			keyInputRef.current?.click()
		} else {
			handleSave()
		}
	}

	const handleSave = async () => {
		setIsSaving(true)
		try {
			await pushSiteContent(formData, faviconItem, avatarItem)
			setSiteContent(formData)
			updateBrandColorVariable(formData.theme?.colorBrand)
			setFaviconItem(null)
			setAvatarItem(null)
			onClose()
		} catch (error: any) {
			console.error('Failed to save:', error)
			toast.error(`Save Failed: ${error?.message || 'Unknown Error'}`)
		} finally {
			setIsSaving(false)
		}
	}

	const handleCancel = () => {
		// Clean up preview URLs
		if (faviconItem?.type === 'file') {
			URL.revokeObjectURL(faviconItem.previewUrl)
		}
		if (avatarItem?.type === 'file') {
			URL.revokeObjectURL(avatarItem.previewUrl)
		}
		// Restore to the state when dialog was opened
		setSiteContent(originalData)
		regenerateBubbles()
		// Restore document title and meta if they were changed by preview
		if (typeof document !== 'undefined') {
			document.title = originalData.meta.title
			const metaDescription = document.querySelector('meta[name="description"]')
			if (metaDescription) {
				metaDescription.setAttribute('content', originalData.meta.description)
			}
		}
		updateBrandColorVariable(originalData.theme?.colorBrand)
		setFaviconItem(null)
		setAvatarItem(null)
		onClose()
	}

	const updateBrandColorVariable = (color?: string) => {
		if (typeof document === 'undefined' || !color) return
		document.documentElement.style.setProperty('--color-brand', color)
		if (document.body) {
			document.body.style.setProperty('--color-brand', color)
		}
	}

	const handlePreview = () => {
		setSiteContent(formData)
		regenerateBubbles()

		// Update document title
		if (typeof document !== 'undefined') {
			document.title = formData.meta.title
			const metaDescription = document.querySelector('meta[name="description"]')
			if (metaDescription) {
				metaDescription.setAttribute('content', formData.meta.description)
			}
		}
		updateBrandColorVariable(formData.theme?.colorBrand)

		onClose()
	}

	const handleBrandColorChange = (value: string) => {
		setFormData(prev => ({
			...prev,
			theme: {
				...prev.theme,
				colorBrand: value
			}
		}))
	}

	const handleColorChange = (index: number, value: string) => {
		const newColors = [...formData.backgroundColors]
		newColors[index] = value
		setFormData({ ...formData, backgroundColors: newColors })
	}

	const generateRandomColor = () => {
		const randomChannel = () => Math.floor(Math.random() * 256)
		return `#${[randomChannel(), randomChannel(), randomChannel()]
			.map(channel => channel.toString(16).padStart(2, '0'))
			.join('')
			.toUpperCase()}`
	}

	const handleRandomizeColors = () => {
		const count = Math.floor(Math.random() * 5) + 4 // 4 ~ 8 colors
		const backgroundColors = Array.from({ length: count }, () => generateRandomColor())
		const colorBrand = generateRandomColor()

		setFormData(prev => ({
			...prev,
			backgroundColors,
			theme: {
				...prev.theme,
				colorBrand
			}
		}))
	}

	const handleAddColor = () => {
		setFormData({
			...formData,
			backgroundColors: [...formData.backgroundColors, '#EDDD62']
		})
	}

	const handleRemoveColor = (index: number) => {
		if (formData.backgroundColors.length > 1) {
			const newColors = formData.backgroundColors.filter((_, i) => i !== index)
			setFormData({ ...formData, backgroundColors: newColors })
		}
	}

	const handleFaviconFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		if (!file.type.startsWith('image/')) {
			toast.error('Please select an image file')
			return
		}

		const hash = await hashFileSHA256(file)
		const previewUrl = URL.createObjectURL(file)
		setFaviconItem({ type: 'file', file, previewUrl, hash })
		if (e.currentTarget) e.currentTarget.value = ''
	}

	const handleAvatarFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		if (!file.type.startsWith('image/')) {
			toast.error('Please select an image file')
			return
		}

		const hash = await hashFileSHA256(file)
		const previewUrl = URL.createObjectURL(file)
		setAvatarItem({ type: 'file', file, previewUrl, hash })
		if (e.currentTarget) e.currentTarget.value = ''
	}

	const handleRemoveFavicon = () => {
		if (faviconItem?.type === 'file') {
			URL.revokeObjectURL(faviconItem.previewUrl)
		}
		setFaviconItem(null)
	}

	const handleRemoveAvatar = () => {
		if (avatarItem?.type === 'file') {
			URL.revokeObjectURL(avatarItem.previewUrl)
		}
		setAvatarItem(null)
	}

	const buttonText = isAuth ? 'Save' : 'Import Key'

	return (
		<>
			<input
				ref={keyInputRef}
				type='file'
				accept='.pem'
				className='hidden'
				onChange={async e => {
					const f = e.target.files?.[0]
					if (f) await handleChoosePrivateKey(f)
					if (e.currentTarget) e.currentTarget.value = ''
				}}
			/>

			<DialogModal open={open} onClose={handleCancel} className='card max-h-[90vh] max-w-2xl overflow-y-auto'>
				<div className='mb-6 flex items-center justify-between'>
					<h2 className='text-xl font-semibold'>Site Configuration</h2>
					<div className='flex gap-3'>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={handlePreview}
							className='rounded-xl border bg-white/60 px-6 py-2 text-sm'>
							Preview
						</motion.button>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={handleCancel}
							disabled={isSaving}
							className='rounded-xl border bg-white/60 px-6 py-2 text-sm'>
							Cancel
						</motion.button>
						<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleSaveClick} disabled={isSaving} className='brand-btn px-6'>
							{isSaving ? 'Saving...' : buttonText}
						</motion.button>
					</div>
				</div>

				<div className='space-y-6'>
					<div className='grid grid-cols-2 gap-4'>
						<div>
							<label className='mb-2 block text-sm font-medium'>Favicon</label>
							<input ref={faviconInputRef} type='file' accept='image/*' className='hidden' onChange={handleFaviconFileSelect} />
							<div className='group relative h-20 w-20 cursor-pointer overflow-hidden rounded-lg border bg-white/60'>
								{faviconItem?.type === 'file' ? (
									<img src={faviconItem.previewUrl} alt='favicon preview' className='h-full w-full object-cover' />
								) : (
									<img src='/favicon.png' alt='current favicon' className='h-full w-full object-cover' />
								)}
								<div className='pointer-events-none absolute inset-0 flex items-center justify-center rounded-lg bg-black/40 opacity-0 transition-opacity group-hover:opacity-100'>
									<span className='text-xs text-white'>{faviconItem ? 'Change' : 'Upload'}</span>
								</div>
								{faviconItem && (
									<div className='absolute top-1 right-1 hidden group-hover:block'>
										<motion.button
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
											onClick={e => {
												e.stopPropagation()
												handleRemoveFavicon()
											}}
											className='rounded-md bg-white/90 px-2 py-1 text-xs text-red-500 shadow hover:bg-white'>
											Clean
										</motion.button>
									</div>
								)}
								<div className='absolute inset-0' onClick={() => faviconInputRef.current?.click()} />
							</div>
						</div>

						<div>
							<label className='mb-2 block text-sm font-medium'>Avatar</label>
							<input ref={avatarInputRef} type='file' accept='image/*' className='hidden' onChange={handleAvatarFileSelect} />
							<div className='group relative h-20 w-20 cursor-pointer overflow-hidden rounded-full border bg-white/60'>
								{avatarItem?.type === 'file' ? (
									<img src={avatarItem.previewUrl} alt='avatar preview' className='h-full w-full object-cover' />
								) : (
									<img src='/images/avatar.png' alt='current avatar' className='h-full w-full object-cover' />
								)}
								<div className='pointer-events-none absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100'>
									<span className='text-xs text-white'>{avatarItem ? 'Change' : 'Upload'}</span>
								</div>
								{avatarItem && (
									<div className='absolute top-1 right-1 hidden group-hover:block'>
										<motion.button
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
											onClick={e => {
												e.stopPropagation()
												handleRemoveAvatar()
											}}
											className='rounded-md bg-white/90 px-2 py-1 text-xs text-red-500 shadow hover:bg-white'>
											Clean
										</motion.button>
									</div>
								)}
								<div className='absolute inset-0' onClick={() => avatarInputRef.current?.click()} />
							</div>
						</div>
					</div>

					<div>
						<label className='mb-2 block text-sm font-medium'>Site Title</label>
						<input
							type='text'
							value={formData.meta.title}
							onChange={e => setFormData({ ...formData, meta: { ...formData.meta, title: e.target.value } })}
							className='w-full rounded-lg border bg-gray-100 px-4 py-2 text-sm'
						/>
					</div>

					<div>
						<label className='mb-2 block text-sm font-medium'>Site Description</label>
						<textarea
							value={formData.meta.description}
							onChange={e => setFormData({ ...formData, meta: { ...formData.meta, description: e.target.value } })}
							rows={3}
							className='w-full rounded-lg border bg-gray-100 px-4 py-2 text-sm'
						/>
					</div>

					<div>
						<label className='mb-2 block text-sm font-medium'>Theme Color</label>
						<div className='flex items-center gap-3'>
							<input
								type='color'
								value={formData.theme?.colorBrand ?? '#35bfab'}
								onChange={e => handleBrandColorChange(e.target.value)}
								className='h-10 w-16 cursor-pointer'
							/>
							<input
								type='text'
								value={formData.theme?.colorBrand ?? ''}
								onChange={e => handleBrandColorChange(e.target.value)}
								className='flex-1 rounded-lg border bg-gray-100 px-4 py-2 text-sm'
							/>
						</div>
					</div>

					<div>
						<div className='mb-2 flex items-center justify-between gap-3'>
							<label className='block text-sm font-medium'>Background Color</label>
							<div className='flex gap-2'>
								<motion.button
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									onClick={handleRandomizeColors}
									className='rounded-lg border bg-white/60 px-3 py-1 text-xs whitespace-nowrap'>
									Random Color
								</motion.button>
								<motion.button
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									onClick={handleAddColor}
									className='rounded-lg border bg-white/60 px-3 py-1 text-xs whitespace-nowrap'>
									+ Add Color
								</motion.button>
							</div>
						</div>
						<div className='grid grid-cols-2 gap-3'>
							{formData.backgroundColors.map((color, index) => (
								<div key={index} className='flex items-center gap-2'>
									<input type='color' value={color} onChange={e => handleColorChange(index, e.target.value)} className='h-10 w-16 cursor-pointer' />
									<input
										type='text'
										value={color}
										onChange={e => handleColorChange(index, e.target.value)}
										className='flex-1 rounded-lg border bg-white/60 px-4 py-2 text-sm'
									/>
									{formData.backgroundColors.length > 1 && (
										<motion.button
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
											onClick={() => handleRemoveColor(index)}
											className='rounded-lg border bg-white/60 px-3 py-1 text-xs whitespace-nowrap text-red-500'>
											Del
										</motion.button>
									)}
								</div>
							))}
						</div>
					</div>
				</div>
			</DialogModal>
		</>
	)
}
