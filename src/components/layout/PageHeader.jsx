import React from 'react'
import PropTypes from 'prop-types'
import { ChevronLeft } from 'lucide-react'

export function PageHeader({
  title,
  subtitle,
  action,
  onBack,
  breadcrumbs = []
}) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      {breadcrumbs.length > 0 && (
        <nav className="flex gap-2 text-sm text-gray-600 mb-3">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span>/</span>}
              <a href={crumb.url} className="hover:text-gray-900">{crumb.label}</a>
            </React.Fragment>
          ))}
        </nav>
      )}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
          </div>
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  )
}

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  action: PropTypes.node,
  onBack: PropTypes.func,
  breadcrumbs: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    url: PropTypes.string
  }))
}

export function Footer({ className = '' }) {
  return (
    <footer className={`bg-gray-900 text-gray-300 py-8 ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Features</a></li>
              <li><a href="#" className="hover:text-white">Pricing</a></li>
              <li><a href="#" className="hover:text-white">Blog</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">About</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Docs</a></li>
              <li><a href="#" className="hover:text-white">Help</a></li>
              <li><a href="#" className="hover:text-white">Status</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Privacy</a></li>
              <li><a href="#" className="hover:text-white">Terms</a></li>
              <li><a href="#" className="hover:text-white">Cookies</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex justify-between items-center text-sm">
          <p>&copy; 2024 CodeFlux. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white">Twitter</a>
            <a href="#" className="hover:text-white">GitHub</a>
            <a href="#" className="hover:text-white">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

Footer.propTypes = {
  className: PropTypes.string
}
