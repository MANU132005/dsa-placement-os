'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, ExternalLink, RefreshCw, CheckCircle2, Circle, Star } from 'lucide-react'
import { useData } from '@/context/DataContext'
import { CSTopic } from '@/lib/seedData'

export default function CSFundamentalsPage() {
  const { csTopics, updateCSTopic } = useData()
  const [editingTopic, setEditingTopic] = useState<string | null>(null)
  const [status, setStatus] = useState('Not Started')
  const [confidence, setConfidence] = useState(3)

  const handleEditClick = (topic: CSTopic) => {
    setEditingTopic(topic.topicName)
    setStatus(topic.status)
    setConfidence(topic.confidence || 3)
  }

  const handleSave = (topicName: string) => {
    updateCSTopic(topicName, status, confidence)
    setEditingTopic(null)
  }

  const getStatusBadgeColor = (st: string) => {
    if (st === 'Completed') return 'text-emerald-500 bg-emerald-500/10'
    if (st === 'In Progress') return 'text-amber-500 bg-amber-500/10'
    return 'text-muted-foreground bg-secondary'
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
          CS Fundamentals
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Core CS theory revision cycles (OOP, DBMS, OS, Networks) pre-populated with study playlists
        </p>
      </div>

      {/* TOPICS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {csTopics.map((topic) => {
          const isEditing = editingTopic === topic.topicName
          
          return (
            <div 
              key={topic.topicName}
              className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-5"
            >
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-extrabold text-lg text-foreground flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-primary" />
                      {topic.topicName}
                    </h3>
                    <a
                      href={topic.resourceLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline flex items-center gap-1.5 mt-1 font-semibold"
                    >
                      Open Study Playlist
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${getStatusBadgeColor(topic.status)}`}>
                    {topic.status}
                  </span>
                </div>

                {/* Info */}
                <div className="flex flex-col gap-2 font-mono text-[10px] text-muted-foreground border-t border-border/50 pt-3">
                  <div className="flex justify-between">
                    <span>Last Revised:</span>
                    <span className="text-foreground font-semibold">{topic.lastRevised || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Next Review Date:</span>
                    <span className="text-primary font-bold">{topic.nextRevision || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Confidence Score:</span>
                    <span className="text-foreground font-semibold flex items-center gap-0.5">
                      {topic.confidence ? (
                        <>
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span>{topic.confidence}/5</span>
                        </>
                      ) : (
                        'Not Rated'
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Edit Action Panel */}
              <div className="border-t border-border/50 pt-4 flex justify-end">
                {isEditing ? (
                  <div className="flex items-center gap-3 w-full justify-between text-xs">
                    <div className="flex gap-2.5">
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="bg-secondary/50 border border-border rounded px-2.5 py-1 text-foreground"
                      >
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                      <select
                        value={confidence}
                        onChange={(e) => setConfidence(parseInt(e.target.value))}
                        className="bg-secondary/50 border border-border rounded px-2.5 py-1 text-foreground"
                      >
                        {[1, 2, 3, 4, 5].map((n) => (
                          <option key={n} value={n}>{n} Stars</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setEditingTopic(null)}
                        className="px-2.5 py-1 border border-border rounded text-muted-foreground hover:bg-secondary hover:text-foreground font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSave(topic.topicName)}
                        className="px-2.5 py-1 bg-primary text-primary-foreground rounded font-semibold hover:opacity-90"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEditClick(topic)}
                    className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Log study review</span>
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

    </motion.div>
  )
}
