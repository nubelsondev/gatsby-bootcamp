const path = require("path")

module.exports = {
    onCreateNode({ node, actions }) {
        const { createNodeField } = actions

        if (node.internal.type === "MarkdownRemark") {
            const slug = path.basename(node.fileAbsolutePath, ".md")

            createNodeField({
                node,
                name: "slug",
                value: slug,
            })
        }
    },

    async createPages({ graphql, actions }) {
        const { createPage } = actions

        // Get path to template
        const blogTemplate = path.resolve(`./src/templates/blog.js`)

        // get markdown data
        const res = await graphql(`
            query {
                allMarkdownRemark {
                    edges {
                        node {
                            fields {
                                slug
                            }
                        }
                    }
                }
            }
        `)
        const { edges } = res.data.allMarkdownRemark
        // Create new pages
        edges.forEach(edge => {
            createPage({
                component: blogTemplate,
                path: `/blog/${edge.node.fields.slug}`,
                context: {
                    slug: edge.node.fields.slug,
                },
            })
        })
    },
}
