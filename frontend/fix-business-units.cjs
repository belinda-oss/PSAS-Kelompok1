const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'sections', 'BusinessUnitsSection.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace the card image section with conditional styling for Shofi Eyelash
const oldImageBlock = `{/* Card Image: Full bleed */}
<div className="w-full h-60 sm:h-64 overflow-hidden shrink-0">
                                <img 
                                    src={unit.image} 
                                    alt={unit.title} 
                                    className="w-full h-full object-cover object-center rounded-t-3xl transition-transform duration-700 group-hover:scale-105"
                                    loading="lazy"
                                />
                            </div>`;

const newImageBlock = `{/* Card Image */}
<div className={\`w-full h-60 sm:h-64 overflow-hidden shrink-0 flex items-center justify-center \${unit.id === 'shofi-eyelash' ? 'bg-gradient-to-br from-[#f8e8f0] to-[#fce4ec]' : ''}\`}>
                                <img 
                                    src={unit.image} 
                                    alt={unit.title} 
                                    className={\`rounded-t-3xl transition-transform duration-700 group-hover:scale-105 \${unit.id === 'shofi-eyelash' ? 'w-auto h-full object-contain p-6' : 'w-full h-full object-cover object-center'}\`}
                                    loading="lazy"
                                />
                            </div>`;

if (content.includes('{/* Card Image: Full bleed */}')) {
  // Normalize line endings for matching
  const normalizedContent = content.replace(/\r\n/g, '\n');
  const normalizedOld = oldImageBlock.replace(/\r\n/g, '\n');
  const normalizedNew = newImageBlock.replace(/\r\n/g, '\n');
  
  const result = normalizedContent.replace(normalizedOld, normalizedNew);
  
  if (result !== normalizedContent) {
    fs.writeFileSync(filePath, result, 'utf8');
    console.log('SUCCESS: BusinessUnitsSection.jsx updated');
  } else {
    console.log('WARN: Pattern not matched exactly, trying broader replacement...');
    // Broader approach: replace line by line
    const lines = normalizedContent.split('\n');
    const newLines = [];
    let i = 0;
    while (i < lines.length) {
      if (lines[i].includes('{/* Card Image: Full bleed */}') || lines[i].includes('{/* Card Image */}')) {
        // Found the comment, replace the block
        newLines.push(lines[i].replace('{/* Card Image: Full bleed */}', '{/* Card Image */}'));
        i++;
        // Find the next <div and replace it
        if (i < lines.length && lines[i].includes('className="w-full h-60 sm:h-64 overflow-hidden shrink-0"')) {
          newLines.push(lines[i].replace(
            'className="w-full h-60 sm:h-64 overflow-hidden shrink-0"',
            'className={`w-full h-60 sm:h-64 overflow-hidden shrink-0 flex items-center justify-center ${unit.id === \'shofi-eyelash\' ? \'bg-gradient-to-br from-[#f8e8f0] to-[#fce4ec]\' : \'\'}`}'
          ));
          i++;
          // Find the img tag and replace className
          while (i < lines.length && !lines[i].includes('</div>')) {
            if (lines[i].includes('className="w-full h-full object-cover object-center')) {
              newLines.push(lines[i].replace(
                'className="w-full h-full object-cover object-center rounded-t-3xl transition-transform duration-700 group-hover:scale-105"',
                'className={`rounded-t-3xl transition-transform duration-700 group-hover:scale-105 ${unit.id === \'shofi-eyelash\' ? \'w-auto h-full object-contain p-6\' : \'w-full h-full object-cover object-center\'}`}'
              ));
            } else {
              newLines.push(lines[i]);
            }
            i++;
          }
          newLines.push(lines[i]); // </div>
          i++;
        } else {
          // Just push current line
        }
      } else {
        newLines.push(lines[i]);
        i++;
      }
    }
    fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
    console.log('SUCCESS: BusinessUnitsSection.jsx updated (broader approach)');
  }
} else {
  console.log('ERROR: Could not find card image block');
}
