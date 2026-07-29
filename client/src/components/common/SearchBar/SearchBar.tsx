import { FiSearch } from 'react-icons/fi';
import { InputGroup, Form } from 'react-bootstrap';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = 'Search...' }: SearchBarProps) {
  return (
    <InputGroup style={{ maxWidth: 320 }}>
      <InputGroup.Text className="bg-transparent">
        <FiSearch />
      </InputGroup.Text>
      <Form.Control
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </InputGroup>
  );
}
