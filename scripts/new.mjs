import readline from 'readline'
import fs from 'fs/promises'
import path from 'path'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()))
  })
}

async function main() {
  console.log('This utitity will create a new extension in the src directory.')

  const id = await ask('extension id: ')

  if (!isValidFileName(id)) {
    console.error('❌ Invalid ID. Please use a valid filename.')
    rl.close()
    return
  }

  const dest = `src/${id}.bkext`

  if (await fileExists(dest)) {
    console.error(`❌ src/${id} already exists!`)
    rl.close()
    return
  }

  await fs.cp('./scripts/template.bkext', dest, { recursive: true })
  await fs.writeFile(
    path.join(dest, 'manifest.json'),
    JSON.stringify(
      {
        id: id,
        name: id,
        version: '0.0.0',
        api_version: '0.0.0',
        permissions: [],
        host_permissions: [],
        enabled: true,
        install: true,
      },
      null,
      2
    ),
    'utf-8'
  )

  await fs.writeFile(path.join(dest, 'README.md'), `# ${id}`, 'utf-8')

  console.log(`✅ src/${id} created!`)

  rl.close()
}

main().catch((err) => {
  console.error('❌ Error:', err)
  rl.close()
})

function isValidFileName(name) {
  if (!name || name === '.' || name === '..') return false
  if (name.includes('/') || name.includes('\\')) return false
  const invalidChars = /[<>:"/\\|?*\x00-\x1F]/
  if (invalidChars.test(name)) return false
  return true
}

async function fileExists(filePath) {
  try {
    await access(filePath, constants.F_OK)
    return true
  } catch {
    return false
  }
}
