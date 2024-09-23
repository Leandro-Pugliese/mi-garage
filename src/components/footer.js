import Link from 'next/link';

export default function Footer() {

    const currentYear = () => {
        return new Date(Date.now()).getFullYear()
    }

    return (
        <footer className="bg-violet-900 text-white p-8 text-center">
            <Link href="https://www.leandro-pugliese.com/">Copyright &copy; {currentYear()} Leandro Pugliese</Link>
        </footer>
    );
}