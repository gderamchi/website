import React from 'react'
import { motion } from 'framer-motion'
import ProjectCard from './ProjectCard'
import { Button } from './ui/button'
import { ArrowRight } from 'lucide-react'
import type { Project } from '@/data/projects'

interface ProjectsSectionProps {
  title: string
  projects: Project[]
  viewAllText: string
  lang: string
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  title,
  projects,
  viewAllText,
  lang
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  }

  return (
    <section id="projects" className="py-20 px-4 bg-muted/30">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-balance">
              {title}
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          >
            {projects.map((project, index) => (
              <motion.div key={project.name} variants={itemVariants}>
                <ProjectCard
                  name={project.name}
                  description={project.description[lang as keyof typeof project.description]}
                  image={project.image}
                  topics={project.topics}
                  html_url={project.html_url}
                />
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={itemVariants} className="text-center">
            <Button
              size="lg"
              variant="outline"
              asChild
              className="inline-flex items-center gap-2 group"
            >
              <a href="/projects">
                {viewAllText}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default ProjectsSection
