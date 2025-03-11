import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Link,
  Text,
  Badge,
  Icon,
  HStack,
} from '@chakra-ui/react'
import { Task, Attachment } from '../../data/sampleData'
import {
  AiOutlineFile,
  AiOutlineFileImage,
  AiOutlineFilePdf,
  AiOutlineFileZip,
} from 'react-icons/ai'

interface TaskFilesProps {
  tasks: Task[]
  onTaskClick: (taskId: string) => void
}

interface FileInfo extends Attachment {
  task: Task
  uploadedAt: Date
}

const TaskFiles = ({ tasks, onTaskClick }: TaskFilesProps) => {
  // Extract all files from tasks
  const files: FileInfo[] = tasks
    .filter(task => task.attachments && task.attachments.length > 0)
    .flatMap(task =>
      task.attachments!.map(attachment => ({
        ...attachment,
        task,
        uploadedAt: new Date(task.updatedAt), // Use task's updatedAt as upload date
      }))
    )
    .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return AiOutlineFileImage
    if (type === 'application/pdf') return AiOutlineFilePdf
    if (type === 'application/zip') return AiOutlineFileZip
    return AiOutlineFile
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date)
  }

  return (
    <Box overflowX="auto">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Task</Th>
            <Th>Project</Th>
            <Th>Size</Th>
            <Th>Uploaded</Th>
          </Tr>
        </Thead>
        <Tbody>
          {files.map(file => (
            <Tr key={file.id}>
              <Td>
                <HStack spacing={2}>
                  <Icon as={getFileIcon(file.type)} boxSize={5} />
                  <Link href={file.url} isExternal color="blue.500">
                    {file.name}
                  </Link>
                </HStack>
              </Td>
              <Td>
                <Link
                  color="gray.700"
                  onClick={() => onTaskClick(file.task.id)}
                  cursor="pointer"
                >
                  {file.task.title}
                </Link>
              </Td>
              <Td>
                {file.task.projectId && (
                  <Badge
                    colorScheme="blue"
                    variant="subtle"
                  >
                    {file.task.projectId}
                  </Badge>
                )}
              </Td>
              <Td>
                <Text color="gray.600">{formatFileSize(file.size)}</Text>
              </Td>
              <Td>
                <Text color="gray.600">{formatDate(file.uploadedAt)}</Text>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  )
}

export default TaskFiles 