import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { TagFilter } from "@/app/components/tags/tag-filter"
import { ChatTags } from "@/app/components/tags/chat-tags"
import { useChats } from "@/lib/chat-store/chats/provider"
import { Chats } from "@/lib/chat-store/types"
import {
  Check,
  MagnifyingGlass,
  PencilSimple,
  TrashSimple,
  X,
} from "@phosphor-icons/react"
import { Pin, PinOff, Tag } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import React, { useCallback, useMemo, useState } from "react"
import { formatDate, groupChatsByDate } from "./utils"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

type DrawerHistoryProps = {
  chatHistory: Chats[]
  onSaveEdit: (id: string, newTitle: string) => Promise<void>
  onConfirmDelete: (id: string) => Promise<void>
  trigger: React.ReactNode
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export function DrawerHistory({
  chatHistory,
  onSaveEdit,
  onConfirmDelete,
  trigger,
  isOpen,
  setIsOpen,
}: DrawerHistoryProps) {
  const { pinnedChats, togglePinned } = useChats()
  const [searchQuery, setSearchQuery] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<"search" | "tags">("search")
  const params = useParams<{ chatId: string }>()

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setIsOpen(open)
      if (!open) {
        setSearchQuery("")
        setEditingId(null)
        setEditTitle("")
        setDeletingId(null)
        setSelectedTags([])
      }
    },
    [setIsOpen]
  )

  const handleEdit = useCallback((chat: Chats) => {
    setEditingId(chat.id)
    setEditTitle(chat.title || "")
  }, [])

  const handleSaveEdit = useCallback(
    async (id: string) => {
      setEditingId(null)
      await onSaveEdit(id, editTitle)
    },
    [editTitle, onSaveEdit]
  )

  const handleCancelEdit = useCallback(() => {
    setEditingId(null)
    setEditTitle("")
  }, [])

  const handleDelete = useCallback((id: string) => {
    setDeletingId(id)
  }, [])

  const handleConfirmDelete = useCallback(
    async (id: string) => {
      setDeletingId(null)
      await onConfirmDelete(id)
    },
    [onConfirmDelete]
  )

  const handleCancelDelete = useCallback(() => {
    setDeletingId(null)
  }, [])

  // Toggle tag selection
  const handleTagSelect = useCallback((tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }, [])
  
  // Memoize filtered chats to avoid recalculating on every render
  const filteredChat = useMemo(() => {
    const query = searchQuery.toLowerCase()
    
    // Apply text search filter
    let filtered = query
      ? chatHistory.filter((chat) =>
          (chat.title || "").toLowerCase().includes(query)
        )
      : chatHistory
      
    // Apply tag filters if any are selected
    if (selectedTags.length > 0) {
      filtered = filtered.filter(chat => {
        // If the chat has no tags, exclude it when tags are selected
        if (!chat.tags || !Array.isArray(chat.tags)) return false
        
        // Check if the chat has at least one of the selected tags
        return selectedTags.some(tag => chat.tags?.includes(tag))
      })
    }
    
    return filtered
  }, [chatHistory, searchQuery, selectedTags])
  
  // Group chats by time periods - memoized to avoid recalculation
  const groupedChats = useMemo(() => {
    // When filtering by tags, don't use date grouping
    if (selectedTags.length > 0) {
      return []
    }
    
    return groupChatsByDate(
      // If searching, filter the chatHistory first
      searchQuery ? 
        chatHistory.filter(chat => 
          (chat.title || "").toLowerCase().includes(searchQuery.toLowerCase())
        ) : 
        chatHistory,
      searchQuery
    )
  }, [chatHistory, searchQuery, selectedTags])

  // Render chat item
  const renderChatItem = useCallback(
    (chat: Chats) => (
      <div key={chat.id}>
        <div className="space-y-1.5">
          {editingId === chat.id ? (
            <div className="bg-accent flex items-center justify-between rounded-lg px-2 py-2.5">
              <form
                className="flex w-full items-center justify-between"
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSaveEdit(chat.id)
                }}
              >
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="h-8 flex-1"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleSaveEdit(chat.id)
                    }
                  }}
                />
                <div className="ml-2 flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    type="submit"
                  >
                    <Check className="size-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    type="button"
                    onClick={handleCancelEdit}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              </form>
            </div>
          ) : deletingId === chat.id ? (
            <div className="bg-accent flex items-center justify-between rounded-lg px-2 py-2.5">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleConfirmDelete(chat.id)
                }}
                className="flex w-full items-center justify-between"
              >
                <div className="flex flex-1 items-center">
                  <span className="text-base font-normal">{chat.title}</span>
                  <input
                    type="text"
                    className="sr-only"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        e.preventDefault()
                        handleCancelDelete()
                      } else if (e.key === "Enter") {
                        e.preventDefault()
                        handleConfirmDelete(chat.id)
                      }
                    }}
                  />
                </div>
                <div className="ml-2 flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-muted-foreground hover:text-destructive size-8"
                    type="submit"
                  >
                    <Check className="size-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-muted-foreground hover:text-destructive size-8"
                    onClick={handleCancelDelete}
                    type="button"
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div
              className="group flex items-center justify-between rounded-lg px-2 py-1.5"
              onClick={() => {
                if (params.chatId === chat.id) {
                  handleOpenChange(false)
                }
              }}
            >
              <Link
                href={`/c/${chat.id}`}
                key={chat.id}
                className="flex flex-1 flex-col items-start"
                prefetch
              >
                <span className="line-clamp-1 text-base font-normal">
                  {chat.title || "Untitled Chat"}
                </span>
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-xs font-normal text-gray-500">
                    {formatDate(chat?.updated_at || chat?.created_at)}
                  </span>
                  
                  {chat.tags && chat.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {chat.tags.slice(0, 3).map(tag => (
                        <span 
                          key={tag} 
                          className="bg-secondary text-secondary-foreground text-xs rounded-full px-1.5 py-0.5"
                        >
                          {tag}
                        </span>
                      ))}
                      {chat.tags.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{chat.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
              <div className="flex items-center">
                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-muted-foreground hover:text-foreground size-8"
                    onClick={(e) => {
                      e.preventDefault()
                      togglePinned(chat.id, !chat.pinned)
                    }}
                    type="button"
                    aria-label={chat.pinned ? "Unpin" : "Pin"}
                  >
                    {chat.pinned ? (
                      <PinOff className="size-4 stroke-[1.5px]" />
                    ) : (
                      <Pin className="size-4 stroke-[1.5px]" />
                    )}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-muted-foreground hover:text-foreground size-8"
                    onClick={(e) => {
                      e.preventDefault()
                      handleEdit(chat)
                    }}
                    type="button"
                  >
                    <PencilSimple className="size-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-muted-foreground hover:text-destructive size-8"
                    onClick={(e) => {
                      e.preventDefault()
                      handleDelete(chat.id)
                    }}
                    type="button"
                  >
                    <TrashSimple className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    ),
    [
      handleOpenChange,
      params.chatId,
      editingId,
      deletingId,
      editTitle,
      handleSaveEdit,
      handleCancelEdit,
      handleConfirmDelete,
      handleCancelDelete,
      handleEdit,
      handleDelete,
      togglePinned,
    ]
  )

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        </TooltipTrigger>
        <TooltipContent>History</TooltipContent>
      </Tooltip>
      <DrawerContent>
        <div className="flex h-dvh max-h-[80vh] flex-col">
          <div className="border-b p-4 pb-3">
            <Tabs 
              value={activeTab} 
              onValueChange={(value) => setActiveTab(value as "search" | "tags")}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="search">Search</TabsTrigger>
                <TabsTrigger value="tags">Filter by Tags</TabsTrigger>
              </TabsList>
              
              <TabsContent value="search" className="mt-2">
                <div className="relative">
                  <Input
                    placeholder="Search..."
                    className="rounded-lg py-1.5 pl-8 text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <MagnifyingGlass className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 transform text-gray-400" />
                </div>
              </TabsContent>
              
              <TabsContent value="tags">
                <TagFilter 
                  selectedTags={selectedTags} 
                  onSelectTag={handleTagSelect} 
                  className="mt-2" 
                />
              </TabsContent>
            </Tabs>
          </div>

          <ScrollArea className="flex-1 overflow-auto">
            <div className="flex flex-col space-y-6 px-4 pt-4 pb-8">
              {filteredChat.length === 0 ? (
                <div className="text-muted-foreground py-4 text-center text-sm">
                  {selectedTags.length > 0 
                    ? "No chats found with the selected tags." 
                    : searchQuery 
                      ? "No chats match your search." 
                      : "No chat history found."
                  }
                </div>
              ) : searchQuery || selectedTags.length > 0 ? (
                // When searching or filtering by tags, display a flat list without grouping
                <div className="space-y-2">
                  {filteredChat.map((chat) => renderChatItem(chat))}
                </div>
              ) : (
                <>
                  {pinnedChats.length > 0 && (
                    <div className="space-y-0.5">
                      <h3 className="text-muted-foreground flex items-center gap-1 pl-2 text-sm font-medium">
                        <Pin className="size-3" />
                        Pinned
                      </h3>
                      <div className="space-y-2">
                        {pinnedChats.map((chat) => renderChatItem(chat))}
                      </div>
                    </div>
                  )}
                  {groupedChats?.map((group) => (
                    <div key={group.name} className="space-y-0.5">
                      <h3 className="text-muted-foreground pl-2 text-sm font-medium">
                        {group.name}
                      </h3>
                      <div className="space-y-2">
                        {group.chats.map((chat) => renderChatItem(chat))}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
