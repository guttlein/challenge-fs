import { Container, Button, Card, CardContent, Typography, Divider } from "@mui/material";
import { NavLink } from "react-router";
import { Link, useParams } from "react-router";
import { useFetch } from "./hooks/useFetch";
import Grid from '@mui/material/Grid2';
import { userType, postType } from "./types/customTypes";

const Profile = () => {
    const { userId } = useParams<{ userId: string }>();

    const { data: profileData, loading: profileLoading, error: profileError } = useFetch<userType>(userId ? `users/${userId}` : '');
    const { data: postsData, loading: postsLoading, error: postsError } = useFetch<postType[]>(userId ? `users/${userId}/posts` : '');

    if (profileLoading || postsLoading) {
        return <div>Cargando...</div>;
    }

    if (profileError || postsError) {
        return <div>Error: {profileError || postsError}</div>;
    }

    return (
        <Container>
            <Grid container>
                <Button sx={{ mb: 4 }} variant="contained">
                    <NavLink to="/" style={({ isActive }) => ({
                        color: isActive ? "red" : "black",
                    })}>
                        Volver a la lista de usuarios
                    </NavLink>
                </Button>
            </Grid>

            {/* Perfil de usuario */}
            <Grid container justifyContent="center">
                <Grid size={{ xs: 12, sm: 8, md: 6 }}>
                    <Card sx={{ marginBottom: 4 }}>
                        <CardContent>
                            <Typography variant="h4" gutterBottom>
                                Perfil de {profileData?.name}
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Typography variant="h6">Nombre de usuario:</Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                {profileData?.username}
                            </Typography>

                            <Typography variant="h6">Teléfono:</Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                {profileData?.phone}
                            </Typography>

                            <Typography variant="h6">Email:</Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                {profileData?.email}
                            </Typography>

                            <Typography variant="h6">Direccion:</Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                {profileData?.address.street 
                                + ", " + 
                                profileData?.address.suite 
                                + ", " + 
                                profileData?.address.city 
                                + ", " + 
                                profileData?.address.zipcode}
                                
                            </Typography>

                            <Typography variant="h6">Empresa:</Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                {profileData?.company.name 
                                + ", " + 
                                profileData?.company.catchPhrase
                                + ", " + 
                                profileData?.company.bs}
                            </Typography>

                            <Typography variant="h6">Sitio Web:</Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                <Link to={`http://${profileData?.website}`} target="_blank" rel="noopener noreferrer">
                                    {profileData?.website}
                                </Link>
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Sección de posts */}
            <Typography variant="h2" gutterBottom>
                Posts de {profileData?.name}
            </Typography>

            <Grid container spacing={3}>
                {postsData?.map((post: postType) => (
                    <Grid key={post.id} size={{ xs: 12, sm: 6, md: 4 }}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography gutterBottom variant="h5">
                                    {post.title}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    {post.body}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Profile;
