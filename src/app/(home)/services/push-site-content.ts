import { toBase64Utf8, getRef, createTree, createCommit, updateRef, createBlob, type TreeItem } from '@/lib/github-client'
import { getAuthToken } from '@/lib/auth'
import { GITHUB_CONFIG } from '@/consts'
import { toast } from 'sonner'
import { fileToBase64NoPrefix } from '@/lib/file-utils'
import type { SiteContent } from '../stores/config-store'
import type { FileItem } from '../config-dialog'

export async function pushSiteContent(siteContent: SiteContent, faviconItem?: FileItem | null, avatarItem?: FileItem | null): Promise<void> {
	const token = await getAuthToken()

	toast.info('Fetching branch information...')
	const refData = await getRef(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, `heads/${GITHUB_CONFIG.BRANCH}`)
	const latestCommitSha = refData.sha

	const commitMessage = `Update site configuration`

	toast.info('Preparing the file...')

	const treeItems: TreeItem[] = []

	// Handle favicon upload
	if (faviconItem?.type === 'file') {
		toast.info('Uploading Favicon...')
		const contentBase64 = await fileToBase64NoPrefix(faviconItem.file)
		const blobData = await createBlob(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, contentBase64, 'base64')
		treeItems.push({
			path: 'public/favicon.png',
			mode: '100644',
			type: 'blob',
			sha: blobData.sha
		})
	}

	// Handle avatar upload
	if (avatarItem?.type === 'file') {
		toast.info('Uploading Avatar...')
		const contentBase64 = await fileToBase64NoPrefix(avatarItem.file)
		const blobData = await createBlob(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, contentBase64, 'base64')
		treeItems.push({
			path: 'public/images/avatar.png',
			mode: '100644',
			type: 'blob',
			sha: blobData.sha
		})
	}

	// Handle site content JSON
	const siteContentJson = JSON.stringify(siteContent, null, '\t')
	const siteContentBlob = await createBlob(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, toBase64Utf8(siteContentJson), 'base64')
	treeItems.push({
		path: 'src/config/site-content.json',
		mode: '100644',
		type: 'blob',
		sha: siteContentBlob.sha
	})

	toast.info('Creating file tree...')
	const treeData = await createTree(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, treeItems, latestCommitSha)

	toast.info('Creating a commit...')
	const commitData = await createCommit(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, commitMessage, treeData.sha, [latestCommitSha])

	toast.info('Updating branch...')
	await updateRef(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, `heads/${GITHUB_CONFIG.BRANCH}`, commitData.sha)

	toast.success('Saved successfully!')
}

