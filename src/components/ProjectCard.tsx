import React from 'react'
import { motion } from 'framer-motion'
import { Button } from './ui/button'
import { Github, ExternalLink } from 'lucide-react'
import { cn } from '../lib/utils'

interface ProjectCardProps {
  name: string
  description: string
  image: string
  topics: string[]
  html_url: string
  className?: string
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  name,
  description,
  image,
  topics,
  html_url,
  className
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        "group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-lg",
        className
      )}
    >
      <div className="aspect-video overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-balance">{name}</h3>
        <p className="text-muted-foreground mb-4 text-pretty leading-relaxed">
          {description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {topics.slice(0, 4).map((topic) => (
            <span
              key={topic}
              className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
            >
              {topic}
            </span>
          ))}
          {topics.length > 4 && (
            <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              +{topics.length - 4} more
            </span>
          )}
        </div>
        
        <div className="flex gap-3">
          <Button asChild size="sm" variant="default">
            <a
              href={html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              <Github className="h-4 w-4" />
              View Code
            </a>
          </Button>
          <Button asChild size="sm" variant="outline">
            <a
              href={html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Learn More
            </a>
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export default ProjectCard
