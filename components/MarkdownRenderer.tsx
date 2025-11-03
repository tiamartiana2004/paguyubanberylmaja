import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const renderLine = (line: string, key: any) => {
    // Bold text: **text**
    const parts = line.split(/(\*\*.*?\*\*)/g);
    const renderedParts = parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });

    // Headings
    if (line.startsWith('### ')) {
      return <h3 key={key} className="text-lg font-semibold mt-4 mb-2">{line.substring(4)}</h3>;
    }
    if (line.startsWith('## ')) {
      return <h2 key={key} className="text-xl font-bold mt-5 mb-3">{line.substring(3)}</h2>;
    }
    
    // Paragraph for lines that are not lists or headings
    if (line.trim() !== '' && !line.startsWith('* ')) {
      return <p key={key}>{renderedParts}</p>;
    }

    return null;
  };

  const lines = content.split('\n');
  const elements = [];
  let listItems: React.ReactNode[] = [];

  lines.forEach((line, index) => {
    // List Items: * item
    if (line.startsWith('* ')) {
      const parts = line.substring(2).split(/(\*\*.*?\*\*)/g);
       const renderedParts = parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });
      listItems.push(<li key={index}>{renderedParts}</li>);
    } else {
      // If we were in a list, close it
      if (listItems.length > 0) {
        elements.push(<ul key={`ul-${index - 1}`} className="list-disc list-inside space-y-1 my-3">{listItems}</ul>);
        listItems = [];
      }
      // Render other elements
      const element = renderLine(line, index);
      if (element) {
        elements.push(element);
      }
    }
  });

  // Push any remaining list items at the end
  if (listItems.length > 0) {
    elements.push(<ul key="ul-end" className="list-disc list-inside space-y-1 my-3">{listItems}</ul>);
  }

  return <>{elements}</>;
};

export default MarkdownRenderer;
